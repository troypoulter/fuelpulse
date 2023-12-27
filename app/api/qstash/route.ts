
import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { env } from "@/lib/env.mjs";
import { fuelApiClient } from "@/lib/fuelApi/fuelApiClient";

async function handler(_req: NextRequest) {
    console.log("Retrieving OAuth tokens from the Fuel API");
    const oAuth = await fuelApiClient.getOAuth();
    console.log("OAuth tokens retrieved!");

    console.log("Getting the current fuel prices in NSW");
    const currentPrices = await fuelApiClient.getAllCurrentPrices(oAuth.access_token);
    console.log(`Retrieved current fuel price data for ${currentPrices.stations.length} stations with a ${currentPrices.prices.length} total price data points`)



    // TODO: Store data in database.
    return NextResponse.json(currentPrices);
}

// When deployed in production mode, verify the signature from QStash.
// Otherwise, don't require signature verification for simple local usage.
export const POST = env.NODE_ENV === "production" ? verifySignatureAppRouter(handler) : handler;