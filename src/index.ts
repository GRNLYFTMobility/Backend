import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectPostgres, sequelize } from './connection.ts';
import userRouter from './routes/user.ts'; // no .ts extension

const app = express();
const port = process.env.APP_PORT || 3000; // use a separate port for Express

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function startServer() {
  await connectPostgres();
  await sequelize.sync(); // sync all models

  app.use("/api/users", userRouter);
  app.use("/uploads", express.static("uploads")); // serve images

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
