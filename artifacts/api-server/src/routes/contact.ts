import { Router, type IRouter } from "express";
import { db, contactInquiriesTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }

  await db.insert(contactInquiriesTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
    inquiryType: parsed.data.inquiryType ?? "general",
  });

  res.status(201).json({
    message: "Thank you for reaching out! Our travel specialists will get back to you within 24 hours.",
  });
});

export default router;
