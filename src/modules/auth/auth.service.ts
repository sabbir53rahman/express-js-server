import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  console.log(`current user is  ${user}`)

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const secret = config.jwt_secret as string;
  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role, id: user.userId },
    secret,
    { expiresIn: "7d" }
  );

  return { token, user };
};

const signupUser = async (
  name: string,
  email: string,
  password: string,
  phone:string,
  role: string
) => {
  // user already exists
  const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (existing.rows.length > 0) {
    return { success: false, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, email, hashedPassword, phone, role]
  );

  const newUser = result.rows[0];

  const token = jwt.sign(
    { name: newUser.name, email: newUser.email, role: newUser.role, id:newUser.id },
    config.jwt_secret as string,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: newUser,
  };
};

export const authServices = {
  loginUser,
  signupUser
};
