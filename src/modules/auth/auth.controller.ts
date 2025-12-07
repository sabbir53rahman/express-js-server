import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    const result = await authServices.loginUser(email, password);
    console.log(result);
    res.status(200).json({
      success: true,
      message: "login successfull",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const result = await authServices.signupUser(name, email, password, phone, role);

    if (result.success === false) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  loginUser,
  signup,
};
