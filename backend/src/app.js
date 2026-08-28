const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Only needed once at the top

const errorHandler = require("../src/middleware/errorHandler");
const authRouter = require("../src/routes/auth.routes");
const userRouter = require("../src/routes/user.routes");
const ticketRouter = require("../src/routes/ticket.routes"); // Double-check if this should be '../src/' or './'
const activityRoutes = require("../src/routes/activity.routes");
const safetyRoutes = require("../src/routes/safety.routes");
const notificationRoutes = require("../src/routes/notification.routes");

const app = express();

// Global Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/activity", activityRoutes);
app.use("/api/issues", safetyRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handling Middleware (MUST be last)
app.use(errorHandler);

module.exports = app;
