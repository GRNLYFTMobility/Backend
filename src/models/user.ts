import mongoose from "mongoose";


 //Schema
  const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    loginId: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;