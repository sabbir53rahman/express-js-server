import { pool } from "../../config/db";

const createBooking = async (payload: any, userId: number) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status 
     FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const dailyRate = Number(vehicle.rows[0].daily_rent_price);

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const durationDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (durationDays <= 0) {
    throw new Error("End date must be after start date");
  }

  const total_price = dailyRate * durationDays;

  const result = await pool.query(
    `
      INSERT INTO bookings(
        customer_id, vehicle_id, rent_start_date, rent_end_date, total_price
      )
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [userId, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = result.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...booking,
    status: booking.status || "active",
    vehicle: {
      vehicle_name: vehicle.rows[0].vehicle_name,
      daily_rent_price: dailyRate,
    },
  };
};

const getAllBookings = async () => {
  // 1. Fetch all bookings
  const result = await pool.query(`SELECT * FROM bookings ORDER BY id DESC`);
  const bookings = result.rows;

  const finalData = [];

  for (const booking of bookings) {
    const customer = await pool.query(
      `SELECT name, email FROM users WHERE id = $1`,
      [booking.customer_id]
    );

    const vehicle = await pool.query(
      `SELECT vehicle_name, registration_number FROM vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    finalData.push({
      ...booking,
      status: booking.status || "active",
      customer: customer.rows[0],
      vehicle: vehicle.rows[0],
    });
  }

  return finalData;
};

const getUserBookings = async (userId: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC`,
    [userId]
  );
  const bookings = result.rows;

  const finalData = [];

  for (const booking of bookings) {
    const vehicle = await pool.query(
      `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    finalData.push({
      ...booking,
      status: booking.status || "active",
      vehicle: vehicle.rows[0],
    });
  }

  return finalData;
};

const markExpiredBookingsAsReturned = async () => {
  await pool.query(
    `
    UPDATE bookings
    SET status = 'returned', updated_at = NOW()
    WHERE rent_end_date < NOW() AND status != 'returned'
    `
  );
};

const updateBookingStatus = async (id: string, status: string) => {
  await markExpiredBookingsAsReturned();

  const result = await pool.query(
    `
      UPDATE bookings 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `,
    [status, id]
  );

  return result;
};

const makeVehicleAvailable = async (vehicleId: number) => {
  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [vehicleId]
  );
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  makeVehicleAvailable,
};
