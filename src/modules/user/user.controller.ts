import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    const { id, name, email, role, phone } = result.rows[0];
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id, name, email, role, phone },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();

    res.status(200).json({
      success: true,
      message: "User retricved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User retricved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const targetUserId = req.params.id as string;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (loggedInUser.role !== "admin" && loggedInUser.userId !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    const updateData = {
      name,
      email,
      role: loggedInUser.role === "admin" ? role : undefined,
    };

    const result = await userServices.updateUser(updateData, targetUserId);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      id,
      name: updatedName,
      email: updatedEmail,
      role: updatedRole,
      phone,
    } = result.rows[0];

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id,
        name: updatedName,
        email: updatedEmail,
        role: updatedRole,
        phone,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

export const userControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
