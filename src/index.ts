  // src/index.ts
  const express = require("express");
  const { connectMongoDb } = require("./connection");
  const userRouter = require("./routes/user")

  const app = express();
  const port = process.env.PORT || 3000;

  //Connection
  connectMongoDb("mongodb://127.0.0.1:27017/grn-lyft").then(() => 
    console.log("Mongodb Connected!")
  );

  // Middleware - plugin
  app.use(express.urlencoded({extended : false}));
  app.use(express.json());

  //Routes
  app.use("/api/users", userRouter);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });