import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Create booking 
router.post("/", auth("admin","customer"), bookingControllers.createBooking);

// Get all bookings user will get his own booking 
router.get("/", auth(), bookingControllers.getAllBookings);

// Update booking
router.put("/:id", auth("admin","customer"), bookingControllers.updateBooking);

export const bookingRoutes = router;
