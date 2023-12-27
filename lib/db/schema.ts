import { text, integer, sqliteTable, real, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from 'drizzle-zod';

export const stations = sqliteTable('stations', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    code: text('code').notNull().unique(),
    brand: text('brand').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
});

export const insertStationSchema = createInsertSchema(stations);

export const prices = sqliteTable('prices', {
    id: integer('id').primaryKey(),
    stationCode: text('stationCode').notNull().references(() => stations.code),
    fuelType: text('fuelType').notNull(),
    price: real('price').notNull(),
    lastUpdated: text('lastUpdated').notNull(),
}, (t) => ({
    unq: unique().on(t.stationCode, t.fuelType, t.lastUpdated)
}));

export const insertPriceSchema = createInsertSchema(prices);