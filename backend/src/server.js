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

    const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  }
};

start();