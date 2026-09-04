const express = require("express");

const authRouter = express.Router();

const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Authentication + Admin authorization
authRouter.use(authMiddleware);
authRouter.use(roleMiddleware("ADMIN"));


// Admin statistics
authRouter.get("/statistics", adminController.getStatistics);

// Technician management
authRouter.get("/technicians", adminController.getTechnicians);

authRouter.post("/technicians", adminController.createTechnician);

authRouter.patch("/technicians/:id", adminController.updateTechnician);

authRouter.get("/departments",adminController.getDepartments);

module.exports = authRouter;