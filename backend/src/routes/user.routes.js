const express = require("express");

const userController = require("../controllers/user.contoller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const {
  updateProfileValidator,
} = require("../validators/user.validator");

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  userController.getMyProfile,
);

router.patch(
  "/me",
  authMiddleware,
  validate(updateProfileValidator),
  userController.updateMyProfile,
);

module.exports = router;