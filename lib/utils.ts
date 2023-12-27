import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { parse } from 'date-fns';
import { ZodError, ZodSchema } from "zod";
import { CurrentPrices, Station } from "./fuelApi/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWrapper(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! URL: ${url}, Status: ${response.status}, Body: ${errorBody}`);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return Promise.reject(error);
    } else {
      return Promise.reject(new Error('An unknown error occurred during fetch'));
    }
  }
}

export async function fetchAndValidate<T>(url: string, schema: ZodSchema<T>, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetchWrapper(url, options);
    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error.issues);
      throw new Error('Validation failed');
    } else if (error instanceof Error) {
      // Propagating the fetch error with its details
      throw error;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function getClosestStations(currentPrices: CurrentPrices, currentLat: number, currentLon: number): Station[] {
  return currentPrices.stations
    .map(station => ({
      ...station,
      distance: calculateDistance(currentLat, currentLon, station.location.latitude, station.location.longitude)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 20);
}

export function convertToISO8601(dateString: string, timezone: string): string {
  // Parse the date string as being in the specified timezone
  const formatString = 'dd/MM/yyyy HH:mm:ss';
  const parsedDate = parse(dateString, formatString, new Date());

  // Convert the date to UTC
  const dateInUTC = zonedTimeToUtc(parsedDate, timezone);

  // Format the UTC date in ISO 8601 format
  return format(dateInUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}