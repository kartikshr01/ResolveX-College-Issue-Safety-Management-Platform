const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/user.model");
const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");

const seedSafetyTickets = async () => {
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

    // Find departments
    const electricalDepartment = await Department.findOne({
      name: "Electrical",
      active: true,
    });

    const plumbingDepartment = await Department.findOne({
      name: "Plumbing",
      active: true,
    });

    const maintenanceDepartment = await Department.findOne({
      name: "Civil / Maintenance",
      active: true,
    });

    if (!electricalDepartment) {
      throw new Error("Electrical department not found.");
    }

    if (!plumbingDepartment) {
      throw new Error("Plumbing department not found.");
    }

    if (!maintenanceDepartment) {
      throw new Error("Civil / Maintenance department not found.");
    }

    // =========================
    // TICKET 1 - ELECTRICAL
    // =========================

    const electricalTitle = "Exposed Electrical Wire - Safety Test";

    const existingElectrical = await Ticket.findOne({
      title: electricalTitle,
    });

    if (existingElectrical) {
      console.log("Electrical safety ticket already exists");
    } else {
      const electricalTicket = await Ticket.create({
        userId: user._id,
        departmentId: electricalDepartment._id,

        title: electricalTitle,

        description:
          "An exposed electrical wire has been noticed near the main corridor. This may create a serious safety risk and requires immediate attention.",

        category: "Electrical",

        location: "Main Building - Ground Floor",

        priority: "CRITICAL",

        safetyFlag: true,

        imageUrl:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",

        status: "OPEN",
      });

      console.log("Electrical safety ticket created:", electricalTicket._id);
    }

    // =========================
    // TICKET 2 - PLUMBING
    // =========================

    const plumbingTitle = "Water Leakage in Second Floor Washroom";

    const existingPlumbing = await Ticket.findOne({
      title: plumbingTitle,
    });

    if (existingPlumbing) {
      console.log("Plumbing safety ticket already exists");
    } else {
      const plumbingTicket = await Ticket.create({
        userId: user._id,
        departmentId: plumbingDepartment._id,

        title: plumbingTitle,

        description:
          "Continuous water leakage has been noticed under the washbasin in the second floor washroom. The wet floor may create a slipping hazard and could cause further water damage if not repaired soon.",

        category: "Plumbing",

        location: "Main Building - Second Floor",

        priority: "HIGH",

        safetyFlag: true,

        imageUrl:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",

        status: "OPEN",
      });

      console.log("Plumbing safety ticket created:", plumbingTicket._id);
    }

    // =========================
    // TICKET 3 - CIVIL / MAINTENANCE
    // =========================

    const maintenanceTitle = "Broken Ceiling Light in Parking Area";

    const existingMaintenance = await Ticket.findOne({
      title: maintenanceTitle,
    });

    if (existingMaintenance) {
      console.log("Civil / Maintenance safety ticket already exists");
    } else {
      const maintenanceTicket = await Ticket.create({
        userId: user._id,
        departmentId: maintenanceDepartment._id,

        title: maintenanceTitle,

        description:
          "One of the ceiling lights in the parking area is not working properly. The area becomes poorly lit during the evening and may create a safety concern for people using the parking facility.",

        category: "Civil / Maintenance",

        location: "Basement Parking - Block A",

        priority: "MEDIUM",

        safetyFlag: true,

        imageUrl:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2",

        status: "OPEN",
      });

      console.log(
        "Civil / Maintenance safety ticket created:",
        maintenanceTicket._id,
      );
    }

    console.log("Safety ticket seeding completed successfully");
  } catch (error) {
    console.error("Safety seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedSafetyTickets();
