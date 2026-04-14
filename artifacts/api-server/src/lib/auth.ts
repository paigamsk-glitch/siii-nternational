import crypto from "crypto";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "s_intl_salt_2026").digest("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(sessionsTable).values({ userId, token, expiresAt });
  return token;
}

export async function getUserFromToken(token: string | undefined) {
  if (!token) return null;

  try {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, token));

    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
      return null;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId));

    return user || null;
  } catch (err) {
    logger.error({ err }, "Error looking up session");
    return null;
  }
}

export function getTokenFromRequest(req: { cookies?: Record<string, string>; headers: Record<string, string | string[] | undefined> }): string | undefined {
  if (req.cookies?.["auth_token"]) {
    return req.cookies["auth_token"];
  }
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return undefined;
}
