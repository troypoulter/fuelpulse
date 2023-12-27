import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const stations = sqliteTable('stations', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').notNull(),
});