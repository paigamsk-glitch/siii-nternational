import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";

export const cmsContentTable = pgTable("cms_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  type: text("type").notNull().default("text"),
  label: text("label").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blockedUsersTable = pgTable("blocked_users", {
  userId: uuid("user_id").primaryKey(),
  blockedAt: timestamp("blocked_at", { withTimezone: true }).notNull().defaultNow(),
  reason: text("reason").notNull().default(""),
});

export type CmsContent = typeof cmsContentTable.$inferSelect;
export type InsertCmsContent = typeof cmsContentTable.$inferInsert;
