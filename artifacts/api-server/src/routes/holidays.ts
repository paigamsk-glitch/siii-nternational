import { Router, type IRouter } from "express";
import { SearchHolidaysQueryParams } from "@workspace/api-zod";
import { searchHolidays } from "../data/holidays";
import { offersData, destinationsData, testimonialsData } from "../data/offers";

const router: IRouter = Router();

router.get("/holidays/search", async (req, res): Promise<void> => {
  const parsed = SearchHolidaysQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters", message: parsed.error.message });
    return;
  }

  const { destination, theme, duration, maxPrice } = parsed.data;

  const packages = searchHolidays({
    destination: destination ?? undefined,
    theme: theme ?? undefined,
    duration: duration ?? undefined,
    maxPrice: maxPrice ?? undefined,
  });

  res.json({ packages });
});

router.get("/offers", async (_req, res): Promise<void> => {
  res.json({ offers: offersData });
});

router.get("/destinations/popular", async (_req, res): Promise<void> => {
  res.json({ destinations: destinationsData });
});

router.get("/testimonials", async (_req, res): Promise<void> => {
  res.json({ testimonials: testimonialsData });
});

export default router;
