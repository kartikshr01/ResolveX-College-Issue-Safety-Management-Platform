const express = require("express");

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const roleMiddleware = require("../middleware/role.middleware");

const {
  updateProfileValidator,
  changePasswordValidator
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

router.patch(
  "/change-password",
  authMiddleware,
  validate(changePasswordValidator),
  userController.changePassword,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.getAllUsers
);

module.exports = router;