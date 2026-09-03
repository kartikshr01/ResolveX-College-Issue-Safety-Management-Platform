const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const authRouter = require("../src/routes/auth.routes");
const userRouter = require("../src/routes/user.routes");
const ticketRouter = require("./routes/ticket.routes");
const safetyRoutes = require("./routes/safety.routes");
const notificationRoutes = require("./routes/notification.routes");
const activityRoutes = require("./routes/activity.routes");
const errorHandler = require("../src/middleware/errorHandler");
const adminRouter = require("../src/routes/admin.routes");



const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());


app.use("/api/activity", activityRoutes);
app.use("/api/issues", safetyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);


module.exports = app;