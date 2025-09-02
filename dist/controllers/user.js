var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import User from '../models/user.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : 'default-secret';
export const getUserById = function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Request received for user ID:", req.params.userId);
        const user = yield User.findOne({ userId: req.params.userId });
        if (!user)
            return res.status(404).json({ error: "user not found" });
        return res.json(user);
    });
};
export const updateUserById = function updateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield User.findByIdAndUpdate(req.params.id, { role: req.body.role });
        const user = yield User.findById({ _id: req.params.id });
        return res.status(200).json({ status: "success", user });
    });
};
export const createNewUser = function createNewUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const hashedPassword = yield bcrypt.hash(body.password, 10);
        console.log(body);
        const user = yield User.create({
            userId: randomUUID(),
            loginId: body.loginId,
            password: hashedPassword,
            role: body.role,
            status: body.status
        });
        const savedUser = yield user.save();
        return res.status(201).json({ msg: "success", savedUser });
    });
};
export const loggedInUser = function loggedInUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loginId, password } = req.body;
            console.log("Login attempt:", loginId);
            const user = yield User.findOne({ loginId });
            console.log("Found user:", user);
            if (!user) {
                console.log("User not found");
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const passwordMatch = yield bcrypt.compare(password, user.password);
            console.log("Password match:", passwordMatch);
            if (!passwordMatch) {
                console.log("Password incorrect");
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const token = jwt.sign({ userId: user._id }, secretKey, {
                expiresIn: '1h',
            });
            return res.status(200).json({ msg: "success", token, user });
        }
        catch (error) {
            console.log('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    });
};
