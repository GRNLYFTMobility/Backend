import express from 'express';
import type { Request, Response, NextFunction } from 'express'; 
import { User } from "../models/user.ts";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY ?? "default-secret";

/**
 * 📘 Get user by UUID (`userId`)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log("🔍 Request received for user ID:", userId);

    const user = await User.findOne({ where: { userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Error fetching user" });
  }
};

/**
 * ✏️ Update user role by numeric `id`
 */
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;

    const [updated] = await User.update(
      { role, status },
      { where: { userId }, returning: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    const updatedUser = await User.findByPk(userId);
    return res.status(200).json({ status: "success", user: updatedUser });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Error updating user" });
  }
};

/**
 * 🆕 Create a new user (password is hashed automatically)
 */
export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { loginId, password, role, status } = req.body;

    if (!loginId || !password || !role)
      return res.status(400).json({ error: "Missing required fields" });

    // Check if loginId already exists
    const existingUser = await User.findOne({ where: { loginId } });
    if (existingUser)
      return res.status(409).json({ error: "Login ID already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: randomUUID(),
      loginId,
      password: hashedPassword,
      role,
      status,
    });

    return res.status(201).json({ msg: "User created successfully", user });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Error creating user" });
  }
};

/**
 * 🔐 Authenticate user (login)
 */
export const loggedInUser = async (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password)
      return res.status(400).json({ error: "Login ID and password required" });

    const user = await User.findOne({ where: { loginId } });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Upload profile image controller
export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save the image path in the user table
    user.profile_image = req.file.path;
    await user.save();

    res.status(200).json({ message: "Profile image uploaded", user });
  } catch (err) {
    console.error("❌ Error uploading profile image:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};