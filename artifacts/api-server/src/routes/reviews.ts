import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, packagesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

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

export default router;
