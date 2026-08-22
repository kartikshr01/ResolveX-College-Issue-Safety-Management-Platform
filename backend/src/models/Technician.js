const mongoose = require(mongoose);
const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
      minlength: 10,
    },
    department: {
      type: mongoose.Schema.Types.objectId,
      ref: "Department ",
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    currentWorkload: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: active,
    },
  },
  { timeStamps: true },
);
