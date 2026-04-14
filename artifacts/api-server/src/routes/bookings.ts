import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateBookingBody, GetBookingByIdParams } from "@workspace/api-zod";
import { getUserFromToken, getTokenFromRequest } from "../lib/auth";
import { flightsData } from "../data/flights";
import { hotelsData } from "../data/hotels";
import { holidaysData } from "../data/holidays";

const router: IRouter = Router();

function getItemDetails(type: string, itemId: string) {
  if (type === "flight") {
    return flightsData.find((f) => f.id === itemId) ?? null;
  } else if (type === "hotel") {
    return hotelsData.find((h) => h.id === itemId) ?? null;
  } else if (type === "holiday") {
    return holidaysData.find((p) => p.id === itemId) ?? null;
  }
  return null;
}

router.post("/bookings", async (req, res): Promise<void> => {
  const token = getTokenFromRequest(req as Parameters<typeof getTokenFromRequest>[0]);
  const user = await getUserFromToken(token);

  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }

  const itemDetails = getItemDetails(parsed.data.type, parsed.data.itemId);

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      userId: user?.id ?? null,
      type: parsed.data.type,
      itemId: parsed.data.itemId,
      travelers: parsed.data.travelers,
      checkIn: parsed.data.checkIn ?? null,
      checkOut: parsed.data.checkOut ?? null,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone,
      totalAmount: String(parsed.data.totalAmount),
      currency: parsed.data.currency,
      status: "confirmed",
      paymentStatus: "unpaid",
      itemDetails: itemDetails as unknown as Record<string, unknown>,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  res.status(201).json({
    id: booking.id,
    userId: booking.userId,
    type: booking.type,
    itemId: booking.itemId,
    travelers: booking.travelers,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    contactName: booking.contactName,
    contactEmail: booking.contactEmail,
    contactPhone: booking.contactPhone,
    totalAmount: Number(booking.totalAmount),
    currency: booking.currency,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    itemDetails: booking.itemDetails,
    notes: booking.notes,
    createdAt: booking.createdAt.toISOString(),
  });
});

router.get("/bookings", async (req, res): Promise<void> => {
  const token = getTokenFromRequest(req as Parameters<typeof getTokenFromRequest>[0]);
  const user = await getUserFromToken(token);

  if (!user) {
    res.status(401).json({ error: "Unauthorized", message: "Please log in to view your bookings." });
    return;
  }

  const bookings = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.userId, user.id))
    .orderBy(bookingsTable.createdAt);

  res.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      userId: b.userId,
      type: b.type,
      itemId: b.itemId,
      travelers: b.travelers,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      contactName: b.contactName,
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone,
      totalAmount: Number(b.totalAmount),
      currency: b.currency,
      status: b.status,
      paymentStatus: b.paymentStatus,
      itemDetails: b.itemDetails,
      notes: b.notes,
      createdAt: b.createdAt.toISOString(),
    })),
  });
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  const token = getTokenFromRequest(req as Parameters<typeof getTokenFromRequest>[0]);
  const user = await getUserFromToken(token);

  const where = user
    ? and(eq(bookingsTable.id, params.data.id), eq(bookingsTable.userId, user.id))
    : eq(bookingsTable.id, params.data.id);

  const [booking] = await db.select().from(bookingsTable).where(where);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json({
    id: booking.id,
    userId: booking.userId,
    type: booking.type,
    itemId: booking.itemId,
    travelers: booking.travelers,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    contactName: booking.contactName,
    contactEmail: booking.contactEmail,
    contactPhone: booking.contactPhone,
    totalAmount: Number(booking.totalAmount),
    currency: booking.currency,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    itemDetails: booking.itemDetails,
    notes: booking.notes,
    createdAt: booking.createdAt.toISOString(),
  });
});

export default router;
