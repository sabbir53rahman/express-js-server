import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, role]
  );
  return result;
};

const getAllUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUser = async (
  data: { name?: string; email?: string; role?: string },
  id: string
) => {
  const { name, email, role } = data;

  const result = await pool.query(
    `UPDATE users SET 
       name = COALESCE($1, name), 
       email = COALESCE($2, email),
       role = COALESCE($3, role)
     WHERE id = $4
     RETURNING *`,
    [name, email, role, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rows.length > 0) {
    return {
      success: false,
      message: "Cannot delete this user: active bookings exist",
    };
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );

  if (result.rowCount === 0) {
    return {
      success: false,
      message: "User not found",
    };
  }

  return {
    success: true,
    message: "User deleted successfully",
    data: result.rows[0],
    rowCount: result.rowCount,
  };
};

export const userServices = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
