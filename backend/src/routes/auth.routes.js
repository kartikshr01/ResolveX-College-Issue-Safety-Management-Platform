const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const validationMiddleware = require("../middleware/validation.middleware");

const {
  registrationValidator,
  loginValidator,
} = require("../validators/auth.validator");

router.post(
  "/register",
  validationMiddleware(registrationValidator),
  authController.register,
);

router.post(
  "/login",
  validationMiddleware(loginValidator),
  authController.login,
);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

module.exports = router;
