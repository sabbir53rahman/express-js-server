import express, { NextFunction, Request, Response } from "express";

import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";
import { bookingRoutes } from "./modules/booking/booking.route";

const app = express();

//parser
app.use(express.json());
//from data pawar jonno
app.use(express.urlencoded());

//initialize db
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello sabbir!");
});

// users CRUD
app.use("/api/v1/users", userRoutes);

// authentication route
app.use("/api/v1/auth", authRoutes);

//vehicle route
app.use("/api/v1/vehicles", vehicleRoutes);

//booking route
app.use("/api/v1/bookings", bookingRoutes);

//not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
