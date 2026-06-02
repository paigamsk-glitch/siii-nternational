import { pgTable, text, uuid, timestamp, numeric, jsonb, boolean, real } from "drizzle-orm/pg-core";

export const destinationsAdminTable = pgTable("destinations_admin", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  country: text("country").notNull().default(""),
  description: text("description").notNull().default(""),
  bannerImage: text("banner_image").notNull().default(""),
  images: jsonb("images").$type<string[]>().default([]),
  bestTimeToVisit: text("best_time_to_visit").notNull().default(""),
  attractions: jsonb("attractions").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  startingPrice: numeric("starting_price", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("INR"),
  rating: real("rating").notNull().default(4.5),
  isPopular: boolean("is_popular").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DestinationAdmin = typeof destinationsAdminTable.$inferSelect;
export type InsertDestinationAdmin = typeof destinationsAdminTable.$inferInsert;
