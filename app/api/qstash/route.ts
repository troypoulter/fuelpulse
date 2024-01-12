
import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { env } from "@/lib/env.mjs";
import { fuelApiClient } from "@/lib/fuelApi/fuelApiClient";
import { insertPriceSchema, insertStationSchema, prices, stations } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { convertToISO8601 } from "@/lib/utils";

// As we can deal with a large amount of data, breaking it down
// into small batches ensures we don't performance hit the API
// or exceed any SQLite limitations of inserts at a time.
const BATCH_SIZE = 1000;

async function handler(_req: NextRequest) {
    console.log("Retrieving OAuth tokens from the Fuel API");
    const oAuth = await fuelApiClient.getOAuth();
    console.log("OAuth tokens retrieved!");

    // TODO: Investigate why when deployed, `searchParams` are undefined.
    // const currentPrices = _req.nextUrl.searchParams.has('getAll', "true") ? await fuelApiClient.getAllCurrentPrices(oAuth.access_token) : await fuelApiClient.getNewPrices(oAuth.access_token);
    const currentPrices = await fuelApiClient.getNewPrices(oAuth.access_token);
    console.log(`Retrieved current fuel price data for ${currentPrices.stations.length} stations with ${currentPrices.prices.length} total price data points`)

    const stationDbInsert = currentPrices.stations.map((station) => {
        return insertStationSchema.parse({
            name: station.name,
            address: station.address,
            state: station.state,
            code: station.code,
            brand: station.brand,
            latitude: station.location.latitude,
            longitude: station.location.longitude
        })
    });

    let newStationsInserted = 0;
    console.log('Inserting new stations into the DB...')
    for (let i = 0; i < stationDbInsert.length; i += BATCH_SIZE) {
        const batch = stationDbInsert.slice(i, i + BATCH_SIZE);
        const result = await db.insert(stations).values(batch).onConflictDoNothing();
        newStationsInserted += result.rowsAffected;
    }
    console.log(`Finished inserting ${newStationsInserted} new stations into the DB!`)

    const pricesDbInsert = currentPrices.prices.map((price) => {
        return insertPriceSchema.parse({
            stationCode: price.stationcode.toString(),
            fuelType: price.fueltype,
            price: price.price,
            state: price.state,
            lastUpdatedRaw: price.lastupdated,
            lastUpdatedUTC: convertToISO8601(price.lastupdated, 'Australia/Sydney')
        })
    });

    let newPricesInserted = 0;
    console.log('Inserting new prices into the DB...');
    for (let i = 0; i < pricesDbInsert.length; i += BATCH_SIZE) {
        const batch = pricesDbInsert.slice(i, i + BATCH_SIZE);
        const result = await db.insert(prices).values(batch).onConflictDoNothing();
        newPricesInserted += result.rowsAffected;
    }
    console.log(`Finished inserting ${newPricesInserted} new prices into the DB!`)

    // Only return the data if we're in development mode.
    // Otherwise, return a simple success message.
    // As this call is very expensive/unoptimised and uses up too much of the monthly allowance
    // of the read/write allowance.
    if (env.NODE_ENV === "development") {
        const combinedResult = await db.query.stations.findMany({
            with: {
                prices: {
                    orderBy: (prices, { desc }) => [desc(prices.id)]
                }
            }
        });

        return NextResponse.json(combinedResult);
    }

    return NextResponse.json({
        success: true,
    })
}

// When deployed in production mode, verify the signature from QStash.
// Otherwise, don't require signature verification for simple local usage.
export const POST = env.NODE_ENV === "production" ? verifySignatureAppRouter(handler) : handler;