const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRouter = require("../src/routes/auth.routes");
// const userRouter = require("../src/routes/user.routes");
const errorHandler = require("../src/middleware/errorHandler");
const adminRouter = require("../src/routes/admin.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

module.exports = app;