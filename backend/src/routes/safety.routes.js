const express = require("express");

const router = express.Router();

const safetyController = require("../controllers/safety.controller");

router.get("/public", safetyController.getPublicSafetyIssues);

module.exports = router;