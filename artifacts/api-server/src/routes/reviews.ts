import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, packagesTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

// GET /api/packages/:slug/reviews
router.get("/packages/:slug/reviews", async (req, res) => {
  try {
    const { slug } = req.params;
    const pkgRows = await db
      .select({ id: packagesTable.id })
      .from(packagesTable)
      .where(eq(packagesTable.slug, slug))
      .limit(1);

    if (!pkgRows.length) {
      return res.status(404).json({ error: "Package not found" });
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.packageId, pkgRows[0].id))
      .orderBy(desc(reviewsTable.createdAt));

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /api/packages/:slug/reviews
router.post("/packages/:slug/reviews", async (req, res) => {
  try {
    const { slug } = req.params;
    const { reviewerName, reviewerCity, rating, title, body, travelMonth } = req.body;

    if (!reviewerName || !rating || !title || !body) {
      return res.status(400).json({ error: "Name, rating, title, and review text are required." });
    }

    const pkgRows = await db
      .select({ id: packagesTable.id })
      .from(packagesTable)
      .where(eq(packagesTable.slug, slug))
      .limit(1);

    if (!pkgRows.length) {
      return res.status(404).json({ error: "Package not found" });
    }

    const [review] = await db
      .insert(reviewsTable)
      .values({
        packageId: pkgRows[0].id,
        reviewerName: reviewerName.trim(),
        reviewerCity: reviewerCity?.trim() || "",
        rating: Math.min(5, Math.max(1, Number(rating))),
        title: title.trim(),
        body: body.trim(),
        travelMonth: travelMonth?.trim() || "",
        helpfulCount: 0,
        isVerified: 0,
      })
      .returning();

    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// PATCH /api/packages/:slug/reviews/:id/helpful
router.patch("/packages/:slug/reviews/:id/helpful", async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db
      .update(reviewsTable)
      .set({ helpfulCount: sql`${reviewsTable.helpfulCount} + 1` })
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ helpfulCount: updated.helpfulCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to update helpful count" });
  }
});

export default router;
