// We need to use the `<img>` tag in the response, so disabling these two rules.
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';
import { db } from "@/lib/db";
import { count } from "drizzle-orm"
import { stations } from "@/lib/db/schema"
import { env } from '@/lib/env.mjs';
import { promises } from 'fs';

// We can't read from local SQLite database in edge runtime, so need to use nodejs.
// Likewise, we can't use fetch in nodejs runtime, so need to use fs.
// export const runtime = env.NODE_ENV === 'development' ? 'nodejs' : 'edge';
export const runtime = 'edge';

// const fontDataURL = env.NODE_ENV === 'development' ? '../../../assets/InterTight-Bold.ttf' : './assets/InterTight-Bold.ttf';
// const backgroundDataURL = env.NODE_ENV === 'development' ? '../../../assets/fuel_pulse_og_background.png' : './assets/fuel_pulse_og_background.png';

export async function GET() {
    // let fontData: ArrayBuffer;
    // let backgroundData: ArrayBuffer;

    // if (env.NODE_ENV === 'development') {
    //     fontData = await promises.readFile('./assets/InterTight-Bold.ttf');
    //     backgroundData = await promises.readFile('./assets/fuel_pulse_og_background.png');
    // } else {
    const fontData = await fetch(new URL('@/assets/InterTight-Bold.ttf', import.meta.url)).then((res) => res.arrayBuffer());
    const backgroundData = await fetch(new URL('@/assets/fuel_pulse_og_background.png', import.meta.url)).then((res) => res.arrayBuffer());
    // }

    const totalStations = await db.select({ value: count() }).from(stations);

    return new ImageResponse(
        (
            <div tw="h-full w-full flex flex-col items-center relative bg-white">
                <img
                    style={{ objectFit: "cover" }}
                    tw="absolute inset-0 w-full h-full"
                    src={`data:image/png;base64,${Buffer.from(backgroundData).toString('base64')}`}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="168" height="168" viewBox="0 0 168 168" fill="none" stroke="#007DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 5 3 L 19 3 C 20.104353 3 21 3.895647 21 5 L 21 19 C 21 20.104353 20.104353 21 19 21 L 5 21 C 3.895647 21 3 20.104353 3 19 L 3 5 C 3 3.895647 3.895647 3 5 3 Z M 5 3 " transform="matrix(7,0,0,7,0,0)" /><path d="M 17 12 L 15 12 L 13 17 L 11 7 L 9 12 L 7 12 " transform="matrix(7,0,0,7,0,0)" /></svg>
                <h1 tw="text-7xl font-bold text-center text-slate-900 mt-2">Find the best fuel price across {totalStations[0]?.value.toLocaleString()} stations in Australia</h1>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Inter',
                    data: fontData,
                    style: 'normal',
                },
            ],
        },
    );
}