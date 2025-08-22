
import express, { Request, Response } from 'express';

const { getUserById, updateUserById, createNewUser } = require('../controllers/user');
const router = express.Router();
const User = require('../models/user');

  // Routes
  router.get("/:userId", getUserById);
  router.patch("/:id", updateUserById);

  router.post("/", createNewUser);

  module.exports = router;