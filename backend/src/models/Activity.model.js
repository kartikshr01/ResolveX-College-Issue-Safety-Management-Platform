const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "TICKET_CREATED",
        "TICKET_ASSIGNED",
        "STATUS_CHANGED",
        "TICKET_RESOLVED",
        "TICKET_CLOSED",
      ],
      required: true,
    },

    oldStatus: {
      type: String,
      default: null,
    },

    newStatus: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Activity", activitySchema);
