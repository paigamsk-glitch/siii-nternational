import { pgTable, text, uuid, timestamp, integer, real } from "drizzle-orm/pg-core";
import { packagesTable } from "./packages";

export const reviewsTable = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  packageId: uuid("package_id").notNull().references(() => packagesTable.id, { onDelete: "cascade" }),
  reviewerName: text("reviewer_name").notNull(),
  reviewerAvatar: text("reviewer_avatar").notNull().default(""),
  reviewerCity: text("reviewer_city").notNull().default(""),
  rating: real("rating").notNull().default(5),
  title: text("title").notNull().default(""),
  body: text("body").notNull(),
  travelMonth: text("travel_month").notNull().default(""),
  helpfulCount: integer("helpful_count").notNull().default(0),
  isVerified: integer("is_verified").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = typeof reviewsTable.$inferInsert;
