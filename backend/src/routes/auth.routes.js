const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const validationMiddleware = require("../middlewares/validation.middleware");
const {
  registrationValidator,
} = require("../validators/auth.validator");

router.post(
  "/register",
  validationMiddleware(registrationValidator),
  authController.register
);

module.exports = router;