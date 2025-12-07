import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;

    const result = await bookingServices.createBooking(req.body, customer_id);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  const user = req.user?.id;
  console.log(`current user from booking  ${user}`);
  try {
    if (req.user?.role === "admin") {
      const result = await bookingServices.getAllBookings();
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
      });
    }

    const result = await bookingServices.getUserBookings(req.user?.id);
    res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id as string;
    const status = req.body.status;

    const result = await bookingServices.updateBookingStatus(bookingId, status);
    const booking = result.rows[0];

    let message = "Booking updated successfully";

    if (status === "cancelled") {
      const now = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (now >= startDate) {
        return res.status(400).json({
          success: false,
          message: "You cannot cancel the booking after the start date",
        });
      }

      message = "Booking cancelled successfully";
    }

    if (status === "returned") {
      await bookingServices.makeVehicleAvailable(booking.vehicle_id);
      message = "Booking marked as returned. Vehicle is now available";
    }

    res.status(200).json({
      success: true,
      message,
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};
