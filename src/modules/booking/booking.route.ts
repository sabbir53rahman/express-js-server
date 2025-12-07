import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Create booking 
router.post("/", auth(), bookingControllers.createBooking);

// Get all bookings user will get his own booking 
router.get("/", auth(), bookingControllers.getAllBookings);

// Update booking
router.put("/:id", auth(), bookingControllers.updateBooking);

export const bookingRoutes = router;
