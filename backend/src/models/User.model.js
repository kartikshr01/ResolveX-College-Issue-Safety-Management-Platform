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
  enum: ["TECHNICIAN", "ADMIN", "STUDENT", "FACULTY"],
  default: "STUDENT",
},

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
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

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
