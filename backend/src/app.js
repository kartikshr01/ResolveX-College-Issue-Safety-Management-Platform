const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");

const activityRoutes = require("./routes/activity.routes");
const safetyRoutes = require("./routes/safety.routes");
const notificationRoutes = require("./routes/notification.routes");

app.use(express.json());
app.use(cookieParser());

app.use("/api/activity", activityRoutes);
app.use("/api/issues", safetyRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;