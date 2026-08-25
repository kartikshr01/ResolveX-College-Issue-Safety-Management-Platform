const express = require("express");
const app = require("./app")
const connectDB = require("./config/db");
require("dotenv").config();

const start = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`server is listning on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Database Connection Error", err.message);
  }
};

start();