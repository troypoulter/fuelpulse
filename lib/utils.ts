import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { parse } from 'date-fns';
import { ZodError, ZodSchema } from "zod";
import { CurrentPrices, Station } from "./fuelApi/schemas";
import { cache } from "react";
import { db } from "./db";

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

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
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