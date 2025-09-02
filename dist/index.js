// src/index.ts
// Load env variables once at the top
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectMongoDb } from './connection.js';
import userRouter from './routes/user.js';
const app = express();
const port = process.env.PORT || 3000;
//Connection
connectMongoDb("mongodb://127.0.0.1:27017/grn-lyft").then(() => console.log("Mongodb Connected!"));
// Middleware - plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Routes
app.use("/api/users", userRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
