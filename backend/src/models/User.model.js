const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 8,
      maxLength: 100,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["TECHNICIAN", "ADMIN", "STUDENT", "FACULTY"],
    },

    department: {
      type: String,
      enum: [
        "Electrical",
        "Plumbing",
        "IT Support",
        "Maintenance",
        "Cleaning",
        "Security",
        "General Maintenance",
      ],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
