const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");
const uploadImage = require("../utils/uploadImage");
const assignmentService = require("./assignment.service");
const deleteImage = require("../utils/deleteImage");
const notificationService = require("./notification.service");
const activityService = require("./activity.service");
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");
const Technician = require("../models/Technician.model");

// ======================================================
// CREATE TICKET
// ======================================================

const createTicket = async (userId, ticketData, imageFile) => {
  const user = await User.findById(userId);

  if (!user) {
    throw apiError(404, "User not found");
  }

  const department = await Department.findById(ticketData.departmentId);

  if (!department) {
    throw apiError(404, "Department not found");
  }

  if (!department.active) {
    throw apiError(403, "Department is inactive");
  }

  let imageUrl = null;
  let imagePublicId = null;

  if (imageFile) {
    const result = await uploadImage(imageFile.buffer);

    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const ticket = await Ticket.create({
    ...ticketData,
    userId,
    name: user.name,
    imageUrl,
    imagePublicId,
    status: "OPEN",
  });

  // Automatically assign technician
  const assignment = await assignmentService.assignTechnician(
    ticket._id,
    ticket.departmentId,
  );

  // No technician available
  if (!assignment) {
    ticket.status = "PENDING";
    ticket.technicianId = null;

    await ticket.save();
  }

  // Notify ticket creator
  await notificationService.createNotification({
    userId: ticket.userId,
    ticketId: ticket._id,
    type: "TICKET_CREATED",
    message: `Your ticket "${ticket.title}" has been created successfully.`,
  });

  // Find admin
  const admin = await User.findOne({
    role: "ADMIN",
  });

  // Notify admin
  if (admin) {
    await notificationService.createNotification({
      userId: admin._id,
      ticketId: ticket._id,
      type: "TICKET_CREATED",
      message: `New ticket "${ticket.title}" has been created.`,
    });
  }

  // Create activity
  await activityService.createActivity({
    ticketId: ticket._id,
    actorId: ticket.userId,
    action: "TICKET_CREATED",
    message: `You created ticket "${ticket.title}".`,
  });

  // Return updated ticket
  return await Ticket.findById(ticket._id)
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone")
    .populate("userId", "name email");
};

// ======================================================
// GET MY TICKETS
// ======================================================

const getMyTickets = async (user) => {
  const tickets = await Ticket.find({
    userId: user._id,
  })
    .sort({ createdAt: -1 })
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!tickets || tickets.length === 0) {
    throw apiError(404, "No tickets found");
  }

  return tickets;
};

// ======================================================
// GET ASSIGNED TICKETS - TECHNICIAN
// ======================================================

const getAssignedTickets = async (userId) => {
  const technician = await Technician.findOne({
    userId,
  });

  if (!technician) {
    throw apiError(404, "Technician profile not found");
  }

  const tickets = await Ticket.find({
    technicianId: technician._id,
  })
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  return tickets;
};

// ======================================================
// GET TECHNICIAN HISTORY
// ======================================================

const getTechnicianHistory = async (userId) => {
  const technician = await Technician.findOne({
    userId,
  });

  if (!technician) {
    throw apiError(404, "Technician profile not found");
  }

  const tickets = await Ticket.find({
    technicianId: technician._id,
    status: "RESOLVED",
  })
    .sort({ updatedAt: -1 })
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  return tickets;
};

// ======================================================
// GET SINGLE TICKET - TECHNICIAN
// ======================================================

const getTicketByIdForTechnician = async (ticketId, userId) => {
  const technician = await Technician.findOne({
    userId,
  });

  if (!technician) {
    throw apiError(404, "Technician profile not found");
  }

  const ticket = await Ticket.findOne({
    _id: ticketId,
    technicianId: technician._id,
  })
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!ticket) {
    throw apiError(
      404,
      "Ticket not found or not assigned to you",
    );
  }

  return ticket;
};

// ======================================================
// GET ALL TICKETS - ADMIN
// ======================================================

const getAllTickets = async () => {
  const tickets = await Ticket.find()
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email")
    .sort({ createdAt: -1 });

  return tickets;
};

// ======================================================
// GET TICKET BY ID - USER
// ======================================================

const getTicketById = async (ticketId, user) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId: user._id,
  })
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  return ticket;
};

// ======================================================
// GET TICKET BY ID - ADMIN
// ======================================================

const getTicketById_forAdmin = async (ticketId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
  })
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  return ticket;
};

// ======================================================
// DELETE TICKET
// ======================================================

const deleteTicketById = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    return {
      nonDeletable: true,
      ticket,
    };
  }

  // Delete Cloudinary image
  if (ticket.imagePublicId) {
    await deleteImage(ticket.imagePublicId);
  }

  await Ticket.deleteOne({
    _id: ticketId,
    userId,
  });

  // Delete related activities
  await Activity.deleteMany({
    ticketId,
  });

  return {
    nonDeletable: false,
    ticket,
  };
};

// ======================================================
// UPDATE TICKET
// ======================================================

const updateTicketById = async (
  ticketId,
  userId,
  updateData,
) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    throw apiError(
      403,
      "Ticket can only be updated while it is OPEN",
    );
  }

  // Validate department if changed
  if (updateData.departmentId) {
    const department = await Department.findById(
      updateData.departmentId,
    );

    if (!department) {
      throw apiError(404, "Department not found");
    }

    if (!department.active) {
      throw apiError(403, "Department is inactive");
    }
  }

  Object.assign(ticket, updateData);

  await ticket.save();

  return ticket;
};

// ======================================================
// UPDATE TICKET STATUS - TECHNICIAN ONLY
// ======================================================

const updateTicketStatus = async (
  ticketId,
  userId,
  status,
) => {
  const allowedStatuses = [
    "IN_PROGRESS",
    "RESOLVED",
  ];

  const technician = await Technician.findOne({
    userId,
  });

  if (!technician) {
    throw apiError(404, "Technician profile not found");
  }

  const ticket = await Ticket.findOne({
    _id: ticketId,
    technicianId: technician._id,
  });

  if (!ticket) {
    throw apiError(
      404,
      "Ticket not found or not assigned to you",
    );
  }

  // Validate requested status
  if (!allowedStatuses.includes(status)) {
    throw apiError(400, "Invalid ticket status");
  }

  // ASSIGNED -> IN_PROGRESS
  if (
    status === "IN_PROGRESS" &&
    ticket.status !== "ASSIGNED"
  ) {
    throw apiError(
      400,
      "Only ASSIGNED tickets can be moved to IN_PROGRESS",
    );
  }

  // IN_PROGRESS -> RESOLVED
  if (
    status === "RESOLVED" &&
    ticket.status !== "IN_PROGRESS"
  ) {
    throw apiError(
      400,
      "Only IN_PROGRESS tickets can be moved to RESOLVED",
    );
  }

  const previousStatus = ticket.status;

  ticket.status = status;

  await ticket.save();

  // Create activity
  await activityService.createActivity({
    ticketId: ticket._id,
    actorId: technician.userId,
    action: "STATUS_CHANGED",
    oldStatus: previousStatus,
    newStatus: status,
    message: `Ticket status changed from ${previousStatus} to ${status}.`,
  });

  // Notify ticket owner
  await notificationService.createNotification({
    userId: ticket.userId,
    ticketId: ticket._id,
    type: "STATUS_UPDATED",
    message: `Your ticket "${ticket.title}" is now ${status}.`,
  });

  // Return updated ticket
  return await Ticket.findById(ticket._id)
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone")
    .populate("userId", "name email");
};

// ======================================================
// UPDATE TICKET IMAGE
// ======================================================

const updateTicketImage = async (
  ticketId,
  userId,
  imageFile,
) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    throw apiError(
      403,
      "Ticket image can only be updated while it is OPEN",
    );
  }

  if (!imageFile) {
    throw apiError(400, "Image is required");
  }

  const oldImagePublicId = ticket.imagePublicId;

  // Upload new image
  const result = await uploadImage(imageFile.buffer);

  ticket.imageUrl = result.secure_url;
  ticket.imagePublicId = result.public_id;

  await ticket.save();

  // Delete old image
  if (oldImagePublicId) {
    await deleteImage(oldImagePublicId);
  }

  return ticket;
};

// ======================================================
// GET TICKET FOR NOTIFICATION
// ======================================================

const getTicketForNotification = async (
  ticketId,
  user,
) => {
  const query = {
    _id: ticketId,
  };

  // Student / Faculty:
  // Can only access their own ticket.
  if (
    user.role === "STUDENT" ||
    user.role === "FACULTY"
  ) {
    query.userId = user._id;
  }

  // Technician:
  // Can only access tickets assigned to them.
  else if (user.role === "TECHNICIAN") {
    const technician = await Technician.findOne({
      userId: user._id,
    });

    if (!technician) {
      throw apiError(404, "Technician profile not found");
    }

    query.technicianId = technician._id;
  }

  // Admin:
  // Can access any ticket.
  const ticket = await Ticket.findOne(query)
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone")
    .lean();

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  return ticket;
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  deleteTicketById,
  updateTicketById,
  updateTicketImage,
  getAllTickets,
  updateTicketStatus,
  getTicketById_forAdmin,
  getTicketForNotification,
  getAssignedTickets,
  getTechnicianHistory,
  getTicketByIdForTechnician,
};