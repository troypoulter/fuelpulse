import { relations, sql } from "drizzle-orm";
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
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
});

export const stationsRelations = relations(stations, ({ many }) => ({
    prices: many(prices),
}))

export const insertStationSchema = createInsertSchema(stations);

export const prices = sqliteTable('prices', {
    id: integer('id').primaryKey(),
    stationCode: text('stationCode').notNull().references(() => stations.code),
    fuelType: text('fuelType').notNull(),
    price: real('price').notNull(),
    lastUpdatedRaw: text('lastUpdatedRaw').notNull(),
    lastUpdatedUTC: text('lastUpdatedUTC').notNull(),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
}, (t) => ({
    unq: unique().on(t.stationCode, t.fuelType, t.lastUpdatedUTC)
}));

export const pricesRelations = relations(prices, ({ one }) => ({
    station: one(stations, {
        fields: [prices.stationCode],
        references: [stations.code]
    })
}))

export const insertPriceSchema = createInsertSchema(prices);