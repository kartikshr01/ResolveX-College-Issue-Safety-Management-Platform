const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const technicianRoutes = require("./routes/technician.route");
app.use(express.json());
app.use(cookieParser());

app.use("/api/technicians", technicianRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
module.exports = app;