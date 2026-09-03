const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/user.model");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB connected");

    const adminEmail = "testAdmin@ResolveX";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(
      "Admin@12345",
      10
    );

    await User.create({
      name: "Test Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      active: true,
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Admin seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();