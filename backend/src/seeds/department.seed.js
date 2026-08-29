const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Department = require("../models/Department.model");

const departments = [
  {
    name: "Electrical",
    description:
      "Open wires, damaged switches, lights, fans, power problems",
    active: true,
  },
  {
    name: "Plumbing",
    description:
      "Water leakage, taps, drainage and water supply",
    active: true,
  },
  {
    name: "IT Support",
    description:
      "Wi-Fi, computers, projectors and network problems",
    active: true,
  },
  {
    name: "Civil / Maintenance",
    description:
      "Doors, furniture, walls, ceilings and infrastructure",
    active: true,
  },
  {
    name: "Cleaning",
    description:
      "Garbage, sanitation and cleanliness",
    active: true,
  },
  {
    name: "Security",
    description:
      "Unsafe areas and security-related concerns",
    active: true,
  },
  {
    name: "General Maintenance",
    description:
      "Issues that do not fit the above departments",
    active: true,
  },
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    await Department.deleteMany({});

    await Department.insertMany(departments);

    console.log("7 departments inserted successfully.");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding departments:", error);
    process.exit(1);
  }
};

seedDepartments();