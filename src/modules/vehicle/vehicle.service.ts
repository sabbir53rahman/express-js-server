import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
    INSERT INTO vehicles (
      vehicle_name, type, registration_number, daily_rent_price, availability_status
    ) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || "available",
    ]
  );

  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id DESC`);
  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
    UPDATE vehicles
    SET 
      vehicle_name = $1,
      type = $2,
      registration_number = $3,
      daily_rent_price = $4,
      availability_status = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

  return result;
};

const deleteVehicle = async (vehicleId: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status != 'returned'`,
    [vehicleId]
  );

  if (bookingCheck.rows.length > 0) {
    return {
      success: false,
      message: "Cannot delete this vehicle: active bookings exist",
    };
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [vehicleId]
  );

  if (result.rowCount === 0) {
    return { success: false, message: "Vehicle not found" };
  }

  return {
    success: true,
    message: "Vehicle deleted successfully",
    data: result.rows[0],
  };
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
