const Department = require("../models/Department.model");
const Ticket = require("../models/Ticket.model");
const apiError = require("../utils/apiError");
const uploadImage = require("../utils/uploadImage");
const assignmentService = require("./assignment.service");
const deleteImage = require("../utils/deleteImage");
const notificationService = require("./notification.service");
const activityService = require("./activity.service");
const User = require("../models/user.model");
const Activity = require("../models/Activity.model");
const Technician = require("../models/Technician.model");

// Service: Create ticket
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

  // 2. Automatically assign technician
  const assignment = await assignmentService.assignTechnician(
    ticket._id,
    ticket.departmentId
  );

  if (!assignment) {
    ticket.status = "PENDING";
    ticket.technicianId = null;

    await ticket.save();
  } else {
    // Notify assigned technician
    if (assignment.technician?.userId) {
      await notificationService.createNotification({
        userId: assignment.technician.userId,
        ticketId: ticket._id,
        type: "TICKET_ASSIGNED",
        message: `A new ticket "${ticket.title}" has been assigned to you.`,
      });
    }
  }

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
    .populate("technicianId", "name email phone")
    .populate("userId", "name email");

  return updatedTicket;
};

// Service: Get my tickets
const getMyTickets = async (userId) => {
  const tickets = await Ticket.find({ userId })
    .sort({ createdAt: -1 })
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!tickets || tickets.length === 0) {
    throw apiError(404, "No tickets found");
  }

  return tickets;
};

// Service: Get assigned tickets for technician
const getAssignedTickets = async (userId) => {
  const technician = await Technician.findOne({
    userId: userId,
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

// Service: Get resolved tickets for technician
const getTechnicianHistory = async (userId) => {
  const technician = await Technician.findOne({
    userId: userId,
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
    throw apiError(404, "Ticket not found or not assigned to you");
  }

  return ticket;
};

// Service : get all tickets ( admin use only )
const getAllTickets = async () => {
  const tickets = await Ticket.find()
    .populate("userId", "name , email")
    .populate("departmentId", "name")
    .populate("technicianId", "name email")
    .sort({ createdAt: -1 });

  return tickets;
};

// Service: Get ticket by ID
const getTicketById = async (ticketId, userId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  })
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone");

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  return ticket;
};

// Service : Get ticket by ID ( admin use only )
const getTicketById_forAdmin = async (ticketId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
  })
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
const updateTicketById = async (ticketId, userId, updateData) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    throw apiError(403, "Ticket can only be updated while it is OPEN");
  }

  if (updateData.departmentId) {
    const department = await Department.findById(updateData.departmentId);

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

const updateTicketStatus = async (ticketId, status) => {
  const allowedStatuses = [
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw apiError(400, "Invalid ticket status");
  }

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  ticket.status = status;

  await ticket.save();

  return await Ticket.findById(ticketId)
    .populate("departmentId", "name")
    .populate("technicianId", "name email phone")
    .populate("userId", "name email");
};

// Service: Update ticket image
const updateTicketImage = async (ticketId, userId, imageFile) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    userId,
  });

  if (!ticket) {
    throw apiError(404, "Ticket not found");
  }

  if (ticket.status !== "OPEN") {
    throw apiError(403, "Ticket image can only be updated while it is OPEN");
  }

  if (!imageFile) {
    throw apiError(400, "Image is required");
  }

  const oldImagePublicId = ticket.imagePublicId;

  const result = await uploadImage(imageFile.buffer);

  ticket.imageUrl = result.secure_url;
  ticket.imagePublicId = result.public_id;

  await ticket.save();

  if (oldImagePublicId) {
    await deleteImage(oldImagePublicId);
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
  getAllTickets,
  updateTicketStatus,
  getTicketById_forAdmin,
  getAssignedTickets,
  getTechnicianHistory,
  getTicketByIdForTechnician
};