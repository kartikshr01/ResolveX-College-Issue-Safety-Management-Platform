const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/User.model");
const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");

const seedSafetyTicket = async () => {
  try {
    const mongoUrl = process.env.DB_URL || process.env.MONGO_URI;

    if (!mongoUrl) {
      throw new Error("MongoDB connection URL is missing in .env");
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected");

    // Find an active user
    const user = await User.findOne({
      active: true,
    });

    if (!user) {
      throw new Error("No active user found. Create a user first.");
    }

    // Find an active Electrical department
    const department = await Department.findOne({
      name: "Electrical",
      active: true,
    });

    if (!department) {
      throw new Error("Electrical department not found.");
    }

    // Avoid creating the same test ticket repeatedly
    const existingTicket = await Ticket.findOne({
      title: "Exposed Electrical Wire - Safety Test",
    });

    if (existingTicket) {
      console.log("Safety test ticket already exists");
      return;
    }

    const ticket = await Ticket.create({
      userId: user._id,
      departmentId: department._id,

      title: "Exposed Electrical Wire - Safety Test",

      description:
        "An exposed electrical wire has been noticed near the main corridor. This may create a serious safety risk and requires immediate attention.",

      category: "Electrical",

      location: "Main Building - Ground Floor",

      priority: "CRITICAL",

      safetyFlag: true,

      imageUrl: null,

      status: "OPEN",
    });

    console.log("Safety test ticket created successfully");
    console.log("Ticket ID:", ticket._id);
  } catch (error) {
    console.error("Safety seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedSafetyTicket();