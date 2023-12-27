import { env } from "../env.mjs";
import { fetchAndValidate } from "../utils"
import { CurrentPricesSchema, FuelOAuthSchema } from "./schemas"
import { v4 as uuidv4 } from "uuid"

const BASE_FUEL_API_URL = 'https://api.onegov.nsw.gov.au'

export const fuelApiClient = {
    async getOAuth(options: RequestInit = {}) {
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Basic ${Buffer.from(`${env.FUEL_API_KEY}:${env.FUEL_SECRET}`).toString("base64")}`);
        headers.set('Accept', 'application/json');

        const fetchOptions = {
            ...options,
            headers,
          };

        return fetchAndValidate(`${BASE_FUEL_API_URL}/oauth/client_credential/accesstoken?grant_type=client_credentials`, FuelOAuthSchema, fetchOptions)
    },

    async getAllCurrentPrices(access_token: string, options: RequestInit = {}) {
        // TODO: Generate dynamically and return with response.
        const transactionId = uuidv4();
        const requestTimestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
      
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${access_token}`);
        headers.set('apikey', env.FUEL_API_KEY);
        headers.set('transactionid', transactionId);
        headers.set('requesttimestamp', requestTimestamp);
        headers.set('Accept', 'application/json');

        const fetchOptions = {
            ...options,
            headers,
          };

        return fetchAndValidate(`${BASE_FUEL_API_URL}/FuelPriceCheck/v1/fuel/prices`, CurrentPricesSchema, fetchOptions)
    }
}