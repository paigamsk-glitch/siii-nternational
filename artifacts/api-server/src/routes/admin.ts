import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, packagesTable, hotelsAdminTable, destinationsAdminTable, cmsContentTable, usersTable, bookingsTable, blockedUsersTable } from "@workspace/db";
import { reviewsTable } from "@workspace/db/schema";
import { eq, desc, count, sum, sql } from "drizzle-orm";
import { contactInquiriesTable } from "@workspace/db";

const router: IRouter = Router();

const ADMIN_KEYS = ["admin2024", "Shaikh@3786"];

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const key = (req.headers["x-admin-key"] as string) || req.query.adminKey as string;
  if (!key || !ADMIN_KEYS.includes(key)) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/admin", adminAuth as any);

// ── STATS ──────────────────────────────────────────────────────────────────
router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [bookingCount] = await db.select({ count: count() }).from(bookingsTable);
  const [userCount] = await db.select({ count: count() }).from(usersTable);
  const [pkgCount] = await db.select({ count: count() }).from(packagesTable);
  const [hotelCount] = await db.select({ count: count() }).from(hotelsAdminTable);
  const [destCount] = await db.select({ count: count() }).from(destinationsAdminTable);
  const [inquiryCount] = await db.select({ count: count() }).from(contactInquiriesTable);
  const [revenue] = await db.select({ total: sum(bookingsTable.totalAmount) }).from(bookingsTable).where(eq(bookingsTable.paymentStatus, "paid"));
  const recentBookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)).limit(5);

  res.json({
    stats: {
      bookings: bookingCount.count,
      users: userCount.count,
      packages: pkgCount.count,
      hotels: hotelCount.count,
      destinations: destCount.count,
      inquiries: inquiryCount.count,
      revenue: parseFloat(revenue.total ?? "0"),
    },
    recentBookings,
  });
});

// ── PACKAGES ───────────────────────────────────────────────────────────────
router.get("/admin/packages", async (_req, res): Promise<void> => {
  const packages = await db.select().from(packagesTable).orderBy(desc(packagesTable.createdAt));
  res.json({ packages });
});

router.post("/admin/packages", async (req, res): Promise<void> => {
  const {
    slug, title, destination, country, theme, durationNights, durationDays,
    price, offerPrice, overview, highlights, inclusions, exclusions,
    itinerary, images, imageUrl, rating, reviewCount, maxTravelers,
    category, isFeatured, isTrending, isPublished, departureDates, currency,
  } = req.body;

  const [pkg] = await db.insert(packagesTable).values({
    slug: slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
    title, destination, country: country || "", theme: theme || "",
    durationNights: durationNights || 0, durationDays: durationDays || 0,
    price: String(price || 0), offerPrice: offerPrice ? String(offerPrice) : null,
    overview: overview || "", highlights: highlights || [],
    inclusions: inclusions || [], exclusions: exclusions || [],
    itinerary: itinerary || [], images: images || [],
    imageUrl: imageUrl || "", rating: rating || 4.5,
    reviewCount: reviewCount || 0, maxTravelers: maxTravelers || 10,
    category: category || "", isFeatured: isFeatured || false,
    isTrending: isTrending || false, isPublished: isPublished !== false,
    departureDates: departureDates || [], currency: currency || "INR",
  }).returning();

  res.status(201).json({ package: pkg });
});

router.put("/admin/packages/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const updates = { ...req.body, updatedAt: new Date() };
  if (updates.price) updates.price = String(updates.price);
  if (updates.offerPrice) updates.offerPrice = String(updates.offerPrice);

  const [pkg] = await db.update(packagesTable).set(updates).where(eq(packagesTable.id, id)).returning();
  if (!pkg) { res.status(404).json({ error: "Package not found" }); return; }
  res.json({ package: pkg });
});

router.delete("/admin/packages/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  await db.delete(packagesTable).where(eq(packagesTable.id, id));
  res.json({ success: true });
});

// ── HOTELS ─────────────────────────────────────────────────────────────────
router.get("/admin/hotels", async (_req, res): Promise<void> => {
  const hotels = await db.select().from(hotelsAdminTable).orderBy(desc(hotelsAdminTable.createdAt));
  res.json({ hotels });
});

router.post("/admin/hotels", async (req, res): Promise<void> => {
  const {
    name, destination, country, address, stars, category, rating,
    reviewCount, pricePerNight, currency, description, amenities,
    roomTypes, images, imageUrl, isAvailable, checkIn, checkOut,
  } = req.body;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

  const [hotel] = await db.insert(hotelsAdminTable).values({
    name, slug, destination, country: country || "", address: address || "",
    stars: stars || 3, category: category || "Standard",
    rating: rating || 4.0, reviewCount: reviewCount || 0,
    pricePerNight: String(pricePerNight || 0), currency: currency || "INR",
    description: description || "", amenities: amenities || [],
    roomTypes: roomTypes || [], images: images || [],
    imageUrl: imageUrl || "", isAvailable: isAvailable !== false,
    checkIn: checkIn || "14:00", checkOut: checkOut || "12:00",
  }).returning();

  res.status(201).json({ hotel });
});

router.put("/admin/hotels/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const updates = { ...req.body, updatedAt: new Date() };
  if (updates.pricePerNight) updates.pricePerNight = String(updates.pricePerNight);

  const [hotel] = await db.update(hotelsAdminTable).set(updates).where(eq(hotelsAdminTable.id, id)).returning();
  if (!hotel) { res.status(404).json({ error: "Hotel not found" }); return; }
  res.json({ hotel });
});

router.delete("/admin/hotels/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  await db.delete(hotelsAdminTable).where(eq(hotelsAdminTable.id, id));
  res.json({ success: true });
});

// ── DESTINATIONS ───────────────────────────────────────────────────────────
router.get("/admin/destinations", async (_req, res): Promise<void> => {
  const destinations = await db.select().from(destinationsAdminTable).orderBy(desc(destinationsAdminTable.createdAt));
  res.json({ destinations });
});

router.post("/admin/destinations", async (req, res): Promise<void> => {
  const {
    name, country, description, bannerImage, images, bestTimeToVisit,
    attractions, tags, startingPrice, currency, rating, isPopular,
  } = req.body;

  const [dest] = await db.insert(destinationsAdminTable).values({
    name, country: country || "", description: description || "",
    bannerImage: bannerImage || "", images: images || [],
    bestTimeToVisit: bestTimeToVisit || "", attractions: attractions || [],
    tags: tags || [], startingPrice: String(startingPrice || 0),
    currency: currency || "INR", rating: rating || 4.5,
    isPopular: isPopular || false,
  }).returning();

  res.status(201).json({ destination: dest });
});

router.put("/admin/destinations/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const updates = { ...req.body, updatedAt: new Date() };
  if (updates.startingPrice) updates.startingPrice = String(updates.startingPrice);

  const [dest] = await db.update(destinationsAdminTable).set(updates).where(eq(destinationsAdminTable.id, id)).returning();
  if (!dest) { res.status(404).json({ error: "Destination not found" }); return; }
  res.json({ destination: dest });
});

router.delete("/admin/destinations/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  await db.delete(destinationsAdminTable).where(eq(destinationsAdminTable.id, id));
  res.json({ success: true });
});

// ── BOOKINGS ───────────────────────────────────────────────────────────────
router.get("/admin/bookings", async (_req, res): Promise<void> => {
  const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  res.json({ bookings });
});

router.patch("/admin/bookings/:id/status", async (req, res): Promise<void> => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const updates: Record<string, string> = {};
  if (status) updates.status = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;

  const [booking] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, id)).returning();
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
  res.json({ booking });
});

// ── USERS ──────────────────────────────────────────────────────────────────
router.get("/admin/users", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  const blocked = await db.select().from(blockedUsersTable);
  const blockedIds = new Set(blocked.map(b => b.userId));
  const usersWithStatus = users.map(u => ({
    ...u,
    passwordHash: undefined,
    isBlocked: blockedIds.has(u.id),
  }));
  res.json({ users: usersWithStatus });
});

router.patch("/admin/users/:id/block", async (req, res): Promise<void> => {
  const { id } = req.params;
  const existing = await db.select().from(blockedUsersTable).where(eq(blockedUsersTable.userId, id));
  if (existing.length > 0) {
    await db.delete(blockedUsersTable).where(eq(blockedUsersTable.userId, id));
    res.json({ blocked: false });
  } else {
    await db.insert(blockedUsersTable).values({ userId: id, reason: "Admin action" });
    res.json({ blocked: true });
  }
});

// ── INQUIRIES ──────────────────────────────────────────────────────────────
router.get("/admin/inquiries", async (_req, res): Promise<void> => {
  const inquiries = await db.select().from(contactInquiriesTable).orderBy(desc(contactInquiriesTable.createdAt));
  res.json({ inquiries });
});

router.delete("/admin/inquiries/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  await db.delete(contactInquiriesTable).where(eq(contactInquiriesTable.id, id));
  res.json({ success: true });
});

// ── REVIEWS ────────────────────────────────────────────────────────────────
router.get("/admin/reviews", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        id: reviewsTable.id,
        packageId: reviewsTable.packageId,
        packageTitle: packagesTable.title,
        packageSlug: packagesTable.slug,
        reviewerName: reviewsTable.reviewerName,
        reviewerCity: reviewsTable.reviewerCity,
        rating: reviewsTable.rating,
        title: reviewsTable.title,
        body: reviewsTable.body,
        travelMonth: reviewsTable.travelMonth,
        helpfulCount: reviewsTable.helpfulCount,
        isVerified: reviewsTable.isVerified,
        createdAt: reviewsTable.createdAt,
      })
      .from(reviewsTable)
      .innerJoin(packagesTable, eq(reviewsTable.packageId, packagesTable.id))
      .orderBy(desc(reviewsTable.createdAt));
    res.json({ reviews: rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.delete("/admin/reviews/:id", async (req, res): Promise<void> => {
  try {
    await db.delete(reviewsTable).where(eq(reviewsTable.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

router.patch("/admin/reviews/:id/verified", async (req, res): Promise<void> => {
  try {
    const { isVerified } = req.body;
    await db.update(reviewsTable).set({ isVerified }).where(eq(reviewsTable.id, req.params.id));
    res.json({ success: true, isVerified });
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

// ── PUBLIC CMS READ (no auth required) ─────────────────────────────────────
router.get("/cms", async (_req, res): Promise<void> => {
  const content = await db.select().from(cmsContentTable);
  const map: Record<string, any> = {};
  content.forEach(item => { map[item.key] = item.value; });
  res.json({ content: map });
});

// ── CMS CONTENT ────────────────────────────────────────────────────────────
router.get("/admin/cms", async (_req, res): Promise<void> => {
  const content = await db.select().from(cmsContentTable);
  const map: Record<string, any> = {};
  content.forEach(item => { map[item.key] = item.value; });
  res.json({ content: map, items: content });
});

router.put("/admin/cms/:key", async (req, res): Promise<void> => {
  const { key } = req.params;
  const { value, type, label } = req.body;

  const existing = await db.select().from(cmsContentTable).where(eq(cmsContentTable.key, key));
  if (existing.length > 0) {
    await db.update(cmsContentTable).set({ value, type, label, updatedAt: new Date() }).where(eq(cmsContentTable.key, key));
  } else {
    await db.insert(cmsContentTable).values({ key, value, type: type || "text", label: label || key });
  }
  res.json({ success: true });
});

export default router;
