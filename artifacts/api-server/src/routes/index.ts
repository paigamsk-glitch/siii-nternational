import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import flightsRouter from "./flights";
import hotelsRouter from "./hotels";
import holidaysRouter from "./holidays";
import bookingsRouter from "./bookings";
import paymentsRouter from "./payments";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(flightsRouter);
router.use(hotelsRouter);
router.use(holidaysRouter);
router.use(bookingsRouter);
router.use(paymentsRouter);
router.use(contactRouter);

export default router;
