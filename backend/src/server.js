const express = require("express");
const app = require("./app")
const connectDB = require("./config/db");
require("dotenv").config();

const start = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(process.env.PORT, () => {
      console.log(`server is listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Database Connection Error", err.message);
  }
};

start();