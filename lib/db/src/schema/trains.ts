import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const trainsTable = pgTable("trains", {
  trainNumber: text("train_number").primaryKey(),
  trainName: text("train_name").notNull(),
  fromStation: text("from_station").notNull(),
  toStation: text("to_station").notNull(),
  trainType: text("train_type").notNull().default("Express"),
  departureTime: text("departure_time").notNull().default("--:--"),
  arrivalTime: text("arrival_time").notNull().default("--:--"),
  durationMins: integer("duration_mins").notNull().default(0),
  routeKey: text("route_key").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Train = typeof trainsTable.$inferSelect;
