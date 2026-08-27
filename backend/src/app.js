const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const technicianRoutes = require("./routes/technician.routes");
const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");
const activityRoutes = require("./routes/activity.routes");
const safetyRoutes = require("./routes/safety.routes");
const notificationRoutes = require("./routes/notification.routes");

app.use(express.json());
app.use(cookieParser());

app.use("/api/activity", activityRoutes);
app.use("/api/issues", safetyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;