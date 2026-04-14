import { Router, type IRouter } from "express";
import { SearchFlightsQueryParams } from "@workspace/api-zod";
import { searchFlights } from "../data/flights";

const router: IRouter = Router();

router.get("/flights/search", async (req, res): Promise<void> => {
  const parsed = SearchFlightsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters", message: parsed.error.message });
    return;
  }

  const { from, to, cabinClass, travelers } = parsed.data;

  const flights = searchFlights({
    from: from ?? undefined,
    to: to ?? undefined,
    cabinClass: cabinClass ?? undefined,
    travelers: travelers ?? undefined,
  });

  res.json({ flights });
});

export default router;
