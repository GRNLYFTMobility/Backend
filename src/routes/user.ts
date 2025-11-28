
import express from 'express';
import upload from "../middlewares/upload.ts";
import { getUserById, updateUserById, createNewUser, loggedInUser, uploadProfileImage } from '../controllers/user.ts';

const router = express.Router();

  // Routes
  router.get("/:userId", getUserById);
  router.patch("/:userId", updateUserById);

  router.post("/", createNewUser);
  router.post("/login", loggedInUser);

  router.post("/:userId/profile-image", upload.single("profile_image"), uploadProfileImage);

  export default router;