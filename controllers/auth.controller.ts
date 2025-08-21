import express, { Request, Response } from "express";
import { User } from "../models/auth.model";
import bcryptjs from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { imagekit } from "../config/imagekit";

export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, userName } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(200).json({
        message: "User Already Exist Please Login now",
      });
    }

    // Upload profile picture if provided
    let profilePicUrl = "";
    if (req.file) {
      const uploadedFile = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/profiles",
      });
      profilePicUrl = uploadedFile.url; // 👈 Save this in DB
    }

    // Hash the password

    const passwordHashed = await bcryptjs.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: passwordHashed,
      fullName,
      avatar: profilePicUrl,
      // coverImage: coverImage?.url || "",
    });

    if (!user) {
      return res.status(404).json({
        message: "Failed t create User",
      });
    }

    return res.status(200).json({
      message: "Registed Done!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Went Wrong With Server During Register",
      error,
    });
  }
};

// Login User

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not found Please register" });
    }

    const isMatched = await bcryptjs.compare(
      password,
      user?.password.toString()
    );

    if (!isMatched) {
      return res.status(400).json({ message: "Credencial Incorrect" });
    }

    // Generate the Token

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not set in environment variables");
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not defined");
    }

    if (!process.env.ACCESS_TOKEN_EXPIRY) {
      throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
    }

    const token = jwt.sign(
      { _id: user?._id },
      process.env.JWT_ACCESS_SECRET as string, // ✅ cast to string
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string, // ✅ cast to string
      } as SignOptions
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Login",
      error,
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.status(200).json(req.user);
};
