import { Router, type IRouter } from "express";
import { db, contactInquiriesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function sendWhatsAppNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  inquiryType: string;
}) {
  const apiKey = process.env.CALLMEBOT_APIKEY;
  const whatsappPhone = "917777027454";

  if (!apiKey) {
    console.log("[WhatsApp] CALLMEBOT_APIKEY not set — skipping WhatsApp notification");
    return;
  }

  const lines = [
    `📩 *New Inquiry – S International*`,
    ``,
    `👤 *Name:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    data.phone ? `📞 *Phone:* ${data.phone}` : null,
    `🏷️ *Type:* ${data.inquiryType}`,
    `📋 *Subject:* ${data.subject}`,
    ``,
    `💬 *Message:*`,
    data.message,
  ].filter(Boolean).join("\n");

  const url = `https://api.callmebot.com/whatsapp.php?phone=${whatsappPhone}&text=${encodeURIComponent(lines)}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log("[WhatsApp] Notification sent successfully");
    } else {
      console.warn(`[WhatsApp] CallMeBot returned status ${response.status}`);
    }
  } catch (err) {
    console.warn("[WhatsApp] Failed to send notification:", err);
  }
}

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

  sendWhatsAppNotification({
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

router.get("/admin/inquiries", async (req, res): Promise<void> => {
  const { key } = req.query;
  if (key !== "admin2024") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const inquiries = await db
    .select()
    .from(contactInquiriesTable)
    .orderBy(desc(contactInquiriesTable.createdAt));
  res.json({ inquiries });
});

export default router;
