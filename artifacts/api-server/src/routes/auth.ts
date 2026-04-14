import { Router, type IRouter } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  AuthSignupBody,
  AuthLoginBody,
} from "@workspace/api-zod";
import { hashPassword, createSession, getUserFromToken, getTokenFromRequest } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = AuthSignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }

  const { name, email, password, phone } = parsed.data;

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existing) {
    res.status(409).json({ error: "Email already registered", message: "An account with this email already exists." });
    return;
  }

  const passwordHash = hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({ name, email, passwordHash, phone: phone ?? null })
    .returning();

  const token = await createSession(user.id);

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    },
    message: "Account created successfully. Welcome to S International!",
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AuthLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid credentials", message: "The email or password you entered is incorrect." });
    return;
  }

  const token = await createSession(user.id);

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    },
    message: "Welcome back!",
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = getTokenFromRequest(req as Parameters<typeof getTokenFromRequest>[0]);

  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }

  res.clearCookie("auth_token");
  res.json({ message: "You have been logged out successfully." });
});

router.get("/auth/session", async (req, res): Promise<void> => {
  const token = getTokenFromRequest(req as Parameters<typeof getTokenFromRequest>[0]);
  const user = await getUserFromToken(token);

  if (!user) {
    res.json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

export default router;
