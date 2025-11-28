import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize/types"; 
import { sequelize } from "../connection.ts";

export interface UserAttributes {
  id: number;
  userId: string;
  loginId: string;
  password: string;
  role: string;
  status: string;
  profile_image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "status" | "profile_image" | "createdAt" | "updatedAt"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare userId: string;
  declare loginId: string;
  declare password: string;
  declare role: string;
  declare status: string;
  declare profile_image: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true},
    userId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,primaryKey: true },
    loginId: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }, // Make sure column exists in PostgreSQL
    role: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "active" },
    profile_image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
