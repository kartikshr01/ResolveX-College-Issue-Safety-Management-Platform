const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();

const activityRoutes = require("./routes/activity.routes");
const safetyRoutes = require("./routes/safety.routes");
const notificationRoutes = require("./routes/notification.routes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/activity", activityRoutes);
app.use("/api/issues", safetyRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;