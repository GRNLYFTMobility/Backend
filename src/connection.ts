import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

export const sequelize = new Sequelize(
  process.env.POSTGRES_DB || "TripJoiDB",
  process.env.POSTGRES_USER || "rohit",
  process.env.POSTGRES_PASSWORD || "Tripjoi",
  {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  }
);

export async function connectPostgres(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
  }
}