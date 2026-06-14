import { pgTable, text, uuid, timestamp, integer, numeric, jsonb, boolean, real } from "drizzle-orm/pg-core";

export const packagesTable = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().default(""),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  country: text("country").notNull().default(""),
  theme: text("theme").notNull().default(""),
  durationNights: integer("duration_nights").notNull().default(0),
  durationDays: integer("duration_days").notNull().default(0),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  offerPrice: numeric("offer_price", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("INR"),
  overview: text("overview").notNull().default(""),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  inclusions: jsonb("inclusions").$type<string[]>().default([]),
  exclusions: jsonb("exclusions").$type<string[]>().default([]),
  itinerary: jsonb("itinerary").$type<Array<{ day: number; title: string; description: string }>>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  imageUrl: text("image_url").notNull().default(""),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  maxTravelers: integer("max_travelers").notNull().default(10),
  category: text("category").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  departureDates: jsonb("departure_dates").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Package = typeof packagesTable.$inferSelect;
export type InsertPackage = typeof packagesTable.$inferInsert;
