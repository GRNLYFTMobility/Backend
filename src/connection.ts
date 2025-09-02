import mongoose from "mongoose";

export async function connectMongoDb(url: string) {
   return mongoose.connect(url);
}