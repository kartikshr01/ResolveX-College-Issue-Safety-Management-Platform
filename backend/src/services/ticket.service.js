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

// Service: Create ticket
const createTicket = async (userId, ticketData, imageFile) => {
  // Check department
  const department = await Department.findById(
    ticketData.departmentId,
  );

  if (!department) {
    throw apiError(404, "Department not found");
  }

  if (!department.active) {
    throw apiError(403, "Department is inactive");
  }

  // Image variables
  let imageUrl = null;
  let imagePublicId = null;

  // Upload image if provided
  if (imageFile) {
    const result = await uploadImage(imageFile.buffer);

    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const ticket = await Ticket.create({
    ...ticketData,
    userId,
    imageUrl,
    imagePublicId,
    status: "OPEN",
  });

  // 2. Automatically assign technician
  await assignmentService.assignTechnician(
    ticket._id,
    ticket.departmentId,
  );

  // 3. Notify ticket creator
  await notificationService.createNotification({
    userId: ticket.userId,
    ticketId: ticket._id,
    type: "TICKET_CREATED",
    message: `Your ticket "${ticket.title}" has been created successfully.`,
  });

  // 4. Find admin
  const admin = await User.findOne({
    role: "ADMIN",
  });

  // 5. Notify admin
  if (admin) {
    await notificationService.createNotification({
      userId: admin._id,
      ticketId: ticket._id,
      type: "TICKET_CREATED",
      message: `New ticket "${ticket.title}" has been created.`,
    });
  }

  // 6. Create activity
  await activityService.createActivity({
    ticketId: ticket._id,
    actorId: ticket.userId,
    action: "TICKET_CREATED",
    message: `You created ticket "${ticket.title}".`,
  });

  // 7. Fetch updated ticket after technician assignment
  const updatedTicket = await Ticket.findById(ticket._id)
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  return updatedTicket;
};

// Service: Get tickets based on logged-in user's role
const getMyTickets = async (user) => {
  let query = {};

  // STUDENT / FACULTY
  // Show only tickets created by them
  if (
    user.role === "STUDENT" ||
    user.role === "FACULTY"
  ) {
    query.userId = user._id;
  }

  // TECHNICIAN
  // Show only tickets assigned to them
  else if (user.role === "TECHNICIAN") {
    query.technicianId = user._id;
  }

  // ADMIN
  // Show all tickets
  else if (user.role === "ADMIN") {
    query = {};
  }

  const tickets = await Ticket.find(query)
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!tickets || tickets.length === 0) {
    throw apiError(404, "No tickets found");
  }

  return tickets;
};

// Service: Get ticket by ID based on user's role
const getTicketById = async (ticketId, user) => {
  const query = {
    _id: ticketId,
  };

  // STUDENT / FACULTY
  // Can only see their own ticket
  if (
    user.role === "STUDENT" ||
    user.role === "FACULTY"
  ) {
    query.userId = user._id;
  }

  // TECHNICIAN
  // Can only see tickets assigned to them
  else if (user.role === "TECHNICIAN") {
    query.technicianId = user._id;
  }

  // ADMIN
  // No additional restriction
  // Admin can see any ticket

  const ticket = await Ticket.findOne(query)
    .populate("userId", "name email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  return ticket;
};

// Service: Delete ticket
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

  // Delete Cloudinary image if it exists
  if (ticket.imagePublicId) {
    await deleteImage(ticket.imagePublicId);
  }

  await Ticket.deleteOne({
    _id: ticketId,
    userId,
  });

  await Activity.deleteMany({
    ticketId: ticketId,
  });

  return {
    nonDeletable: false,
    ticket,
  };
};

// Service: Update ticket
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

  // Check department if department is being changed
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

// Service: Update ticket image
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

// Service: Get ticket for notification based on user's role
const getTicketForNotification = async (
  ticketId,
  user,
) => {
  const query = {
    _id: ticketId,
  };

  // STUDENT / FACULTY
  // Can open only their own ticket
  if (
    user.role === "STUDENT" ||
    user.role === "FACULTY"
  ) {
    query.userId = user._id;
  }

  // TECHNICIAN
  // Can open only tickets assigned to them
  else if (user.role === "TECHNICIAN") {
    query.technicianId = user._id;
  }

  // ADMIN
  // Can open any ticket
  // No extra filter needed

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

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  deleteTicketById,
  updateTicketById,
  updateTicketImage,
  getTicketForNotification,
};