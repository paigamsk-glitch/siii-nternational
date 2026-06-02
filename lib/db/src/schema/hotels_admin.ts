import { pgTable, text, uuid, timestamp, numeric, jsonb, boolean, real, integer } from "drizzle-orm/pg-core";

export const hotelsAdminTable = pgTable("hotels_admin", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().default(""),
  destination: text("destination").notNull(),
  country: text("country").notNull().default(""),
  address: text("address").notNull().default(""),
  stars: integer("stars").notNull().default(3),
  category: text("category").notNull().default("Standard"),
  rating: real("rating").notNull().default(4.0),
  reviewCount: integer("review_count").notNull().default(0),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("INR"),
  description: text("description").notNull().default(""),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  roomTypes: jsonb("room_types").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  imageUrl: text("image_url").notNull().default(""),
  isAvailable: boolean("is_available").notNull().default(true),
  checkIn: text("check_in").notNull().default("14:00"),
  checkOut: text("check_out").notNull().default("12:00"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type HotelAdmin = typeof hotelsAdminTable.$inferSelect;
export type InsertHotelAdmin = typeof hotelsAdminTable.$inferInsert;
