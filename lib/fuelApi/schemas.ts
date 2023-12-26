import * as z from "zod";


export const FuelTypeSchema = z.enum([
    "B20",
    "DL",
    "E10",
    "E85",
    "EV",
    "LPG",
    "P95",
    "P98",
    "PDL",
    "U91",
]);
export type FuelType = z.infer<typeof FuelTypeSchema>;


export const BrandSchema = z.enum([
    "Ampol",
    "BP",
    "Budget",
    "Caltex",
    "ChargePoint",
    "Chargefox",
    "Coles Express",
    "Costco",
    "EG Ampol",
    "Enhance",
    "EVUp",
    "Everty",
    "Evie Networks",
    "Independent",
    "Independent EV",
    "Inland Petroleum",
    "JOLT",
    "Liberty",
    "Lowes",
    "Metro Fuel",
    "Mobil",
    "NRMA",
    "Pearl Energy",
    "Puma Energy",
    "Shell",
    "South West",
    "Speedway",
    "Tesla",
    "7-Eleven",
    "Transwest Fuels",
    "U-Go",
    "United",
    "Westside",
    "Woodham Petroleum",
]);
export type Brand = z.infer<typeof BrandSchema>;


export const BrandIdSchema = z.enum([
    "GSD-186982",
    "GSD-190678",
    "1-257XHLW",
    "1-257XHLX",
    "1-257XHLY",
    "1-257XHLZ",
    "1-257XHM2",
    "1-281Q9UY",
    "1-2CAVDD5",
    "1-37FJJR1",
    "1-3L9CXTK",
    "1-3LGWPXL",
    "1-3U2AAFV",
    "1-EV00-1",
    "1-EV00-2",
    "1-EV00-3",
    "1-EV00-4",
    "1-EV00-5",
    "1-EV00-6",
    "1-EV00-7",
    "1-GFYV-0",
    "1-GFYV-1",
    "1-GFYV-10",
    "1-GFYV-11",
    "1-GFYV-2",
    "1-GFYV-3",
    "1-GFYV-4",
    "1-GFYV-5",
    "1-GFYV-6",
    "1-GFYV-7",
    "1-GFYV-9",
    "1-M0ZN-3",
    "1-OS9K-0",
    "1-TRE5-0",
]);
export type BrandId = z.infer<typeof BrandIdSchema>;

export const LocationSchema = z.object({
    "latitude": z.number(),
    "longitude": z.number(),
});
export type Location = z.infer<typeof LocationSchema>;

export const StationSchema = z.object({
    "brandid": BrandIdSchema,
    "stationid": z.string(),
    "brand": BrandSchema,
    "code": z.string(),
    "name": z.string(),
    "address": z.string(),
    "location": LocationSchema,
});
export type Station = z.infer<typeof StationSchema>;

export const PriceSchema = z.object({
    "stationcode": z.string(),
    "fueltype": FuelTypeSchema,
    "price": z.number(),
    "lastupdated": z.string(),
});
export type Price = z.infer<typeof PriceSchema>;

export const CurrentPricesSchema = z.object({
    "stations": z.array(StationSchema),
    "prices": z.array(PriceSchema),
});
export type CurrentPrices = z.infer<typeof CurrentPricesSchema>;
