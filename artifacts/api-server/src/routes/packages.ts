import { Router, type IRouter } from "express";
import { db, packagesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/packages", async (_req, res): Promise<void> => {
  const pkgs = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.isPublished, true));
  res.json({ packages: pkgs });
});

router.get("/packages/:slug", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [pkg] = await db
    .select()
    .from(packagesTable)
    .where(and(eq(packagesTable.slug, slug), eq(packagesTable.isPublished, true)));
  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }
  res.json({ package: pkg });
});

export default router;
