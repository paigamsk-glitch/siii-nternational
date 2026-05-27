import { Router, type IRouter } from "express";
import { SearchHotelsQueryParams } from "@workspace/api-zod";
import { searchHotels, getHotelById } from "../data/hotels";

const router: IRouter = Router();

router.get("/hotels/search", async (req, res): Promise<void> => {
  const parsed = SearchHotelsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters", message: parsed.error.message });
    return;
  }

  const { destination, minPrice, maxPrice, rating } = parsed.data;

  const hotels = searchHotels({
    destination: destination ?? undefined,
    minPrice: minPrice ?? undefined,
    maxPrice: maxPrice ?? undefined,
    rating: rating ?? undefined,
  });

  res.json({ hotels });
});

router.get("/hotels/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const hotel = getHotelById(id);
  if (!hotel) {
    res.status(404).json({ error: "Hotel not found" });
    return;
  }
  res.json({ hotel });
});

export default router;
