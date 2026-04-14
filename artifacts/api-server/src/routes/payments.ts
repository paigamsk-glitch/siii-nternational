import { Router, type IRouter } from "express";
import crypto from "crypto";
import { db, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ProcessPaymentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/payments/process", async (req, res): Promise<void> => {
  const parsed = ProcessPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }

  const { bookingId, method } = parsed.data;

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, bookingId));

  if (!booking) {
    res.status(400).json({ error: "Booking not found", message: "No booking found with the provided ID." });
    return;
  }

  // Simulate payment processing — always succeeds in this version
  const transactionId = "TXN" + crypto.randomBytes(8).toString("hex").toUpperCase();

  await db
    .update(bookingsTable)
    .set({ paymentStatus: "paid", status: "confirmed" })
    .where(eq(bookingsTable.id, bookingId));

  res.json({
    success: true,
    transactionId,
    bookingId,
    amount: Number(booking.totalAmount),
    currency: booking.currency,
    method,
    status: "success",
    message: "Payment processed successfully. Your booking is confirmed.",
    timestamp: new Date().toISOString(),
  });
});

export default router;
