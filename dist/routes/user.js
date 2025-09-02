import express from 'express';
import { getUserById, updateUserById, createNewUser, loggedInUser } from '../controllers/user.js';
const router = express.Router();
// Routes
router.get("/:userId", getUserById);
router.patch("/:id", updateUserById);
router.post("/", createNewUser);
router.post("/login", loggedInUser);
export default router;
