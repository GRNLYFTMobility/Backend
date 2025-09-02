import { Request, Response } from 'express';
import User from '../models/user.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
const secretKey = process.env.SECRET_KEY ?? 'default-secret';

export const getUserById = async function getUserById (req: Request, res: Response){
    console.log("Request received for user ID:", req.params.userId);
    const user = await User.findOne({userId: req.params.userId});
    if(!user) return res.status(404).json({ error: "user not found"});
    return res.json(user);
}

export const updateUserById = async function updateUserById (req: Request, res: Response){
    await User.findByIdAndUpdate(req.params.id, {role: req.body.role});
    const user = await User.findById({_id: req.params.id});
    return res.status(200).json({status: "success", user});
}

export const createNewUser = async function createNewUser (req: Request, res: Response){
    const body = req.body;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log(body);
    const user = await User.create({
      userId: randomUUID(), 
      loginId: body.loginId,
      password: hashedPassword,
      role: body.role,
      status: body.status
    });
    const savedUser = await user.save();
    return res.status(201).json({msg: "success", savedUser});
}

export const loggedInUser = async function loggedInUser (req: Request, res: Response){
    try {
        const { loginId, password } = req.body;   
        console.log("Login attempt:", loginId);
        const user = await User.findOne({ loginId });
        console.log("Found user:", user);
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: 'Authentication failed' });
        }
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", passwordMatch);
        if (!passwordMatch) {
            console.log("Password incorrect");
            return res.status(401).json({ error: 'Authentication failed' });
        }
            const token = jwt.sign({ userId: user._id }, secretKey!, {
            expiresIn: '1h',
            });
            return res.status(200).json({ msg: "success", token, user });
     } catch (error) {
            console.log('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
     }
}