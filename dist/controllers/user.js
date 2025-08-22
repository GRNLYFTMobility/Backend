"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const { randomUUID } = require('crypto');
async function getUserById(req, res) {
    console.log("Request received for user ID:", req.params.userId);
    const user = await User.findOne({ userId: req.params.userId });
    if (!user)
        return res.status(404).json({ error: "user not found" });
    return res.json(user);
}
async function updateUserById(req, res) {
    await User.findByIdAndUpdate(req.params.id, { role: "Car Pool" });
    return res.json({ status: "Success" });
}
async function createNewUser(req, res) {
    const body = req.body;
    console.log(body);
    const result = await User.create({
        userId: randomUUID(),
        loginId: body.loginId,
        password: body.password,
        role: body.role,
        status: body.status
    });
    return res.status(201).json({ msg: "success", id: result._id });
}
module.exports = {
    getUserById,
    updateUserById,
    createNewUser
};
