const { createServer } = require("http");
const express = require("express");
const app = require("./app")
const connectDB = require("./config/db");
const {initializeSocket} = require("./config/socket");
require("dotenv").config();

const start = async () => {
  try {
    await connectDB();

    const server = createServer(app);

    initializeSocket(server);

    server.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  }
};

start();