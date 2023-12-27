import * as z from "zod";

export const FuelOAuthSchema = z.object({
    "refresh_token_expires_in": z.string(),
    "api_product_list": z.string(),
    "api_product_list_json": z.array(z.string()),
    "organization_name": z.string(),
    "developer.email": z.string(),
    "token_type": z.string(),
    "issued_at": z.string(),
    "client_id": z.string(),
    "access_token": z.string(),
    "application_name": z.string(),
    "scope": z.string(),
    "expires_in": z.string(),
    "refresh_count": z.string(),
    "status": z.string(),
});
export type FuelOAuth = z.infer<typeof FuelOAuthSchema>;

export const LocationSchema = z.object({
    "latitude": z.number(),
    "longitude": z.number(),
});
export type Location = z.infer<typeof LocationSchema>;

export const StationSchema = z.object({
    "brandid": z.string(),
    "stationid": z.string(),
    "brand": z.string(),
    "code": z.string(),
    "name": z.string(),
    "address": z.string(),
    "location": LocationSchema,
});
export type Station = z.infer<typeof StationSchema>;

export const PriceSchema = z.object({
    "stationcode": z.string(),
    "fueltype": z.string(),
    "price": z.number(),
    "lastupdated": z.string(),
});
export type Price = z.infer<typeof PriceSchema>;

export const CurrentPricesSchema = z.object({
    "stations": z.array(StationSchema),
    "prices": z.array(PriceSchema),
});
export type CurrentPrices = z.infer<typeof CurrentPricesSchema>;
