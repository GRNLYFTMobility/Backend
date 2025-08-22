import mongoose from "mongoose";

async function connectMongoDb(url: any) {
   return mongoose.connect(url);
}

module.exports = {
    connectMongoDb,
}