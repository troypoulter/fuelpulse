
import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { env } from "@/lib/env.mjs";
import { fuelApiClient } from "@/lib/fuelApi/fuelApiClient";
import { insertPriceSchema, insertStationSchema, prices, stations } from "@/lib/db/schema";
import { db } from "@/lib/db";

// As we can deal with a large amount of data, breaking it down
// into small batches ensures we don't performance hit the API
// or exceed any SQLite limitations of inserts at a time.
const BATCH_SIZE = 100;

async function handler(_req: NextRequest) {
    console.log("Retrieving OAuth tokens from the Fuel API");
    const oAuth = await fuelApiClient.getOAuth();
    console.log("OAuth tokens retrieved!");

    console.log("Getting the current fuel prices in NSW");
    const currentPrices = await fuelApiClient.getAllCurrentPrices(oAuth.access_token);
    console.log(`Retrieved current fuel price data for ${currentPrices.stations.length} stations with ${currentPrices.prices.length} total price data points`)

    const stationDbInsert = currentPrices.stations.map((station) => {
        return insertStationSchema.parse({
            name: station.name,
            address: station.address,
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
            stationCode: price.stationcode,
            fuelType: price.fueltype,
            price: price.price,
            lastUpdated: price.lastupdated
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

    const stationsResult = await db.select().from(stations);

    return NextResponse.json(stationsResult);
}

// When deployed in production mode, verify the signature from QStash.
// Otherwise, don't require signature verification for simple local usage.
export const POST = env.NODE_ENV === "production" ? verifySignatureAppRouter(handler) : handler;