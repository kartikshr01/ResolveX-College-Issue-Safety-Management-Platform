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

  if (!allowedStatuses.includes(status)) {
    throw apiError(400, "Invalid ticket status");
  }

  // Find technician profile for logged-in user
  const technician = await Technician.findOne({
    userId,
  });

  if (!technician) {
    throw apiError(404, "Technician profile not found");
  }

  // IMPORTANT:
  // Only this technician's assigned ticket can be changed.
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

  // Enforce status progression
  if (
    status === "IN_PROGRESS" &&
    ticket.status !== "ASSIGNED"
  ) {
    throw apiError(
      400,
      "Only ASSIGNED tickets can be moved to IN_PROGRESS",
    );
  }

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
    action: "STATUS_UPDATED",
    message: `Ticket status changed from ${previousStatus} to ${status}.`,
  });

  // Notify ticket owner
  await notificationService.createNotification({
    userId: ticket.userId,
    ticketId: ticket._id,
    type: "TICKET_STATUS_UPDATED",
    message: `Your ticket "${ticket.title}" is now ${status}.`,
  });

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
 


// const Department = require("../models/Department.model");
// const Ticket = require("../models/Ticket.model");
// const apiError = require("../utils/apiError");
// const uploadImage = require("../utils/uploadImage");
// const deleteImage = require("../utils/deleteImage");
// const assignmentService = require("./assignment.service");
// const notificationService = require("./notification.service");
// const activityService = require("./activity.service");
// const User = require("../models/user.model");
// const Activity = require("../models/Activity.model");
// const Technician = require("../models/Technician.model");

// /**
//  * Populate commonly required ticket fields.
//  */
// const populateTicket = (query) => {
//   return query
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");
// };

// /**
//  * Create a new ticket.
//  */
// const createTicket = async (userId, ticketData, imageFile) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw apiError(404, "User not found");
//   }

//   const department = await Department.findById(ticketData.departmentId);

//   if (!department) {
//     throw apiError(404, "Department not found");
//   }

//   if (!department.active) {
//     throw apiError(403, "Department is inactive");
//   }

//   let imageUrl = null;
//   let imagePublicId = null;

//   if (imageFile) {
//     const result = await uploadImage(imageFile.buffer);

//     imageUrl = result.secure_url;
//     imagePublicId = result.public_id;
//   }

//   const ticket = await Ticket.create({
//     ...ticketData,
//     userId,
//     name: user.name,
//     imageUrl,
//     imagePublicId,
//     status: "OPEN",
//   });

//   // Automatically assign a technician.
//   const assignment = await assignmentService.assignTechnician(
//     ticket._id,
//     ticket.departmentId,
//   );

//   // No technician available.
//   if (!assignment) {
//     ticket.status = "PENDING";
//     ticket.technicianId = null;
//     await ticket.save();
//   }

//   // Notify ticket creator.
//   await notificationService.createNotification({
//     userId: ticket.userId,
//     ticketId: ticket._id,
//     type: "TICKET_CREATED",
//     message: `Your ticket "${ticket.title}" has been created successfully.`,
//   });

//   // Find an admin.
//   const admin = await User.findOne({
//     role: "ADMIN",
//   });

//   // Notify admin.
//   if (admin) {
//     await notificationService.createNotification({
//       userId: admin._id,
//       ticketId: ticket._id,
//       type: "TICKET_CREATED",
//       message: `New ticket "${ticket.title}" has been created.`,
//     });
//   }

//   // Create activity.
//   await activityService.createActivity({
//     ticketId: ticket._id,
//     actorId: ticket.userId,
//     action: "TICKET_CREATED",
//     message: `You created ticket "${ticket.title}".`,
//   });

//   // Return updated ticket with populated references.
//   return populateTicket(Ticket.findById(ticket._id));
// };


// /**
//  * Get tickets created by the logged-in user.
//  */
// const getMyTickets = async (userId) => {
//   const tickets = await populateTicket(
//     Ticket.find({ userId }).sort({ createdAt: -1 }),
//   );

//   if (!tickets || tickets.length === 0) {
//     throw apiError(404, "No tickets found");
//   }

//   return tickets;
// };


// /**
//  * Get tickets assigned to a technician.
//  */
// const getAssignedTickets = async (userId) => {
//   const technician = await Technician.findOne({
//     userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   return populateTicket(
//     Ticket.find({
//       technicianId: technician._id,
//     }).sort({ createdAt: -1 }),
//   );
// };


// /**
//  * Get resolved ticket history for a technician.
//  */
// const getTechnicianHistory = async (userId) => {
//   const technician = await Technician.findOne({
//     userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   return populateTicket(
//     Ticket.find({
//       technicianId: technician._id,
//       status: "RESOLVED",
//     }).sort({ updatedAt: -1 }),
//   );
// };


// /**
//  * Get a specific ticket assigned to the logged-in technician.
//  */
// const getTicketByIdForTechnician = async (ticketId, userId) => {
//   const technician = await Technician.findOne({
//     userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const ticket = await populateTicket(
//     Ticket.findOne({
//       _id: ticketId,
//       technicianId: technician._id,
//     }),
//   );

//   if (!ticket) {
//     throw apiError(404, "Ticket not found or not assigned to you");
//   }

//   return ticket;
// };


// /**
//  * Get all tickets.
//  * Admin use only.
//  */
// const getAllTickets = async () => {
//   return populateTicket(
//     Ticket.find().sort({ createdAt: -1 }),
//   );
// };


// /**
//  * Get a ticket belonging to a specific user.
//  */
// const getTicketById = async (ticketId, userId) => {
//   const ticket = await populateTicket(
//     Ticket.findOne({
//       _id: ticketId,
//       userId,
//     }),
//   );

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// };


// /**
//  * Get any ticket by ID.
//  * Admin use only.
//  */
// const getTicketById_forAdmin = async (ticketId) => {
//   const ticket = await populateTicket(
//     Ticket.findById(ticketId),
//   );

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// };


// /**
//  * Delete a ticket.
//  *
//  * Users can delete only their own OPEN tickets.
//  */
// const deleteTicketById = async (ticketId, userId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     return {
//       nonDeletable: true,
//       ticket,
//     };
//   }

//   // Delete image from Cloudinary if it exists.
//   if (ticket.imagePublicId) {
//     await deleteImage(ticket.imagePublicId);
//   }

//   await Ticket.deleteOne({
//     _id: ticketId,
//     userId,
//   });

//   // Remove related activities.
//   await Activity.deleteMany({
//     ticketId,
//   });

//   return {
//     nonDeletable: false,
//     ticket,
//   };
// };


// /**
//  * Update an OPEN ticket.
//  *
//  * Only explicitly allowed fields can be modified.
//  */
// const updateTicketById = async (
//   ticketId,
//   userId,
//   updateData,
// ) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     throw apiError(
//       403,
//       "Ticket can only be updated while it is OPEN",
//     );
//   }

//   // Only allow user-editable ticket fields.
//   const allowedFields = [
//     "title",
//     "description",
//     "category",
//     "location",
//     "priority",
//     "safetyFlag",
//     "departmentId",
//   ];

//   for (const field of allowedFields) {
//     if (updateData[field] !== undefined) {
//       ticket[field] = updateData[field];
//     }
//   }

//   // If department changes, validate the new department.
//   if (updateData.departmentId) {
//     const department = await Department.findById(
//       updateData.departmentId,
//     );

//     if (!department) {
//       throw apiError(404, "Department not found");
//     }

//     if (!department.active) {
//       throw apiError(403, "Department is inactive");
//     }

//     // Department change can invalidate the current assignment.
//     ticket.technicianId = null;
//     ticket.status = "OPEN";
//   }

//   await ticket.save();

//   // Try to assign a technician again if the department changed.
//   if (updateData.departmentId) {
//     const assignment = await assignmentService.assignTechnician(
//       ticket._id,
//       ticket.departmentId,
//     );

//     if (!assignment) {
//       ticket.status = "PENDING";
//       ticket.technicianId = null;
//       await ticket.save();
//     }
//   }

//   return populateTicket(Ticket.findById(ticket._id));
// };


// /**
//  * Update ticket status.
//  *
//  * IMPORTANT:
//  * Only the technician assigned to the ticket can use this function.
//  *
//  * Allowed workflow:
//  *
//  * ASSIGNED → IN_PROGRESS → RESOLVED
//  */
// const updateTicketStatus = async (
//   ticketId,
//   userId,
//   newStatus,
// ) => {
//   const allowedStatuses = [
//     "IN_PROGRESS",
//     "RESOLVED",
//   ];

//   if (!allowedStatuses.includes(newStatus)) {
//     throw apiError(
//       400,
//       "Invalid status. Technician can only change status to IN_PROGRESS or RESOLVED",
//     );
//   }

//   // Find technician profile belonging to logged-in user.
//   const technician = await Technician.findOne({
//     userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   // Find only a ticket assigned to this technician.
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     technicianId: technician._id,
//   });

//   if (!ticket) {
//     throw apiError(
//       404,
//       "Ticket not found or not assigned to you",
//     );
//   }

//   // Enforce status progression.
//   if (
//     newStatus === "IN_PROGRESS" &&
//     ticket.status !== "ASSIGNED"
//   ) {
//     throw apiError(
//       400,
//       "Only ASSIGNED tickets can be moved to IN_PROGRESS",
//     );
//   }

//   if (
//     newStatus === "RESOLVED" &&
//     ticket.status !== "IN_PROGRESS"
//   ) {
//     throw apiError(
//       400,
//       "Only IN_PROGRESS tickets can be resolved",
//     );
//   }

//   const previousStatus = ticket.status;

//   ticket.status = newStatus;

//   await ticket.save();

//   // Create activity.
//   await activityService.createActivity({
//     ticketId: ticket._id,
//     actorId: technician.userId,
//     action: "STATUS_UPDATED",
//     message: `Ticket status changed from ${previousStatus} to ${newStatus}.`,
//   });

//   // Notify ticket creator.
//   await notificationService.createNotification({
//     userId: ticket.userId,
//     ticketId: ticket._id,
//     type: "TICKET_STATUS_UPDATED",
//     message: `Your ticket "${ticket.title}" is now ${newStatus}.`,
//   });

//   return populateTicket(
//     Ticket.findById(ticket._id),
//   );
// };


// /**
//  * Update ticket image.
//  *
//  * Only the ticket owner can update the image,
//  * and only while the ticket is OPEN.
//  */
// const updateTicketImage = async (
//   ticketId,
//   userId,
//   imageFile,
// ) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     throw apiError(
//       403,
//       "Ticket image can only be updated while it is OPEN",
//     );
//   }

//   if (!imageFile) {
//     throw apiError(400, "Image is required");
//   }

//   const oldImagePublicId = ticket.imagePublicId;

//   // Upload new image.
//   const result = await uploadImage(imageFile.buffer);

//   ticket.imageUrl = result.secure_url;
//   ticket.imagePublicId = result.public_id;

//   await ticket.save();

//   // Delete old image after successful save.
//   if (oldImagePublicId) {
//     await deleteImage(oldImagePublicId);
//   }

//   return populateTicket(
//     Ticket.findById(ticket._id),
//   );
// };


// module.exports = {
//   createTicket,
//   getMyTickets,
//   getTicketById,
//   deleteTicketById,
//   updateTicketById,
//   updateTicketImage,
//   getAllTickets,
//   updateTicketStatus,
//   getTicketById_forAdmin,
//   getAssignedTickets,
//   getTechnicianHistory,
//   getTicketByIdForTechnician,
// };



// const Department = require("../models/Department.model");
// const Ticket = require("../models/Ticket.model");
// const apiError = require("../utils/apiError");
// const uploadImage = require("../utils/uploadImage");
// const assignmentService = require("./assignment.service");
// const deleteImage = require("../utils/deleteImage");
// const notificationService = require("./notification.service");
// const activityService = require("./activity.service");
// const User = require("../models/user.model");
// const Activity = require("../models/Activity.model");
// const Technician = require("../models/Technician.model");

// // Service: Create ticket
// const createTicket = async (userId, ticketData, imageFile) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw apiError(404, "User not found");
//   }
//   const department = await Department.findById(ticketData.departmentId);

//   if (!department) {
//     throw apiError(404, "Department not found");
//   }

//   if (!department.active) {
//     throw apiError(403, "Department is inactive");
//   }

//   let imageUrl = null;
//   let imagePublicId = null;

//   if (imageFile) {
//     const result = await uploadImage(imageFile.buffer);

//     imageUrl = result.secure_url;
//     imagePublicId = result.public_id;
//   }

//   const ticket = await Ticket.create({
//     ...ticketData,
//     userId,
//     imageUrl,
//     imagePublicId,
//     status: "OPEN",
//   });

//   // 2. Automatically assign technician
//   const assignment = await assignmentService.assignTechnician(
//   ticket._id,
//   ticket.departmentId
// );
//   await assignmentService.assignTechnician(
//     ticket._id,
//     ticket.departmentId,
//   );

// if (!assignment) {
//   ticket.status = "PENDING";
//   ticket.technicianId = null;
//   await ticket.save();
// }
//   // 3. Notify ticket creator
//   await notificationService.createNotification({
//     userId: ticket.userId,
//     ticketId: ticket._id,
//     type: "TICKET_CREATED",
//     message: `Your ticket "${ticket.title}" has been created successfully.`,
//   });

//   // 4. Find admin
//   const admin = await User.findOne({
//     role: "ADMIN",
//   });

//   // 5. Notify admin
//   if (admin) {
//     await notificationService.createNotification({
//       userId: admin._id,
//       ticketId: ticket._id,
//       type: "TICKET_CREATED",
//       message: `New ticket "${ticket.title}" has been created.`,
//     });
//   }

//   // 6. Create activity
//   await activityService.createActivity({
//     ticketId: ticket._id,
//     actorId: ticket.userId,
//     action: "TICKET_CREATED",
//     message: `You created ticket "${ticket.title}".`,
//   });

//   // 7. Fetch updated ticket after technician assignment
//   const updatedTicket = await Ticket.findById(ticket._id)
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone")
//     .populate("userId", "name email");

//   return updatedTicket;
// };

// // Service: Get tickets based on logged-in user's role
// const getMyTickets = async (user) => {
//   let query = {};

//   // STUDENT / FACULTY
//   // Show only tickets created by them
//   if (
//     user.role === "STUDENT" ||
//     user.role === "FACULTY"
//   ) {
//     query.userId = user._id;
//   }

//   // TECHNICIAN
//   // Show only tickets assigned to them
//   else if (user.role === "TECHNICIAN") {
//     query.technicianId = user._id;
//   }

//   // ADMIN
//   // Show all tickets
//   else if (user.role === "ADMIN") {
//     query = {};
//   }

//   const tickets = await Ticket.find(query)
//     .sort({ createdAt: -1 })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!tickets || tickets.length === 0) {
//     throw apiError(404, "No tickets found");
//   }

//   return tickets;
// };

// // Service: Get ticket by ID based on user's role
// const getTicketById = async (ticketId, user) => {
//   const query = {
// // Service: Get assigned tickets for technician
// const getAssignedTickets = async (userId) => {
//   const technician = await Technician.findOne({
//     userId: userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const tickets = await Ticket.find({
//     technicianId: technician._id,
//   })
//     .sort({ createdAt: -1 })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   return tickets;
// };
// // Service: Get resolved tickets for technician
// const getTechnicianHistory = async (userId) => {
//   const technician = await Technician.findOne({
//     userId: userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const tickets = await Ticket.find({
//     technicianId: technician._id,
//     status: "RESOLVED",
//   })
//     .sort({ updatedAt: -1 })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   return tickets;
// };
// const getTicketByIdForTechnician = async (ticketId, userId) => {
//   const technician = await Technician.findOne({
//     userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     technicianId: technician._id,
//   })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!ticket) {
//     throw apiError(404, "Ticket not found or not assigned to you");
//   }

//   return ticket;
// };
// // Service : get all tickets ( admin use only )
// const getAllTickets = async () => {
//   const tickets = await Ticket.find()
//     .populate("userId", "name , email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email")
//     .sort({ createdAt: -1 });

//   return tickets;
// };

// // Service: Get ticket by ID
// const getTicketById = async (ticketId, userId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//   };

//   // STUDENT / FACULTY
//   // Can only see their own ticket
//   if (
//     user.role === "STUDENT" ||
//     user.role === "FACULTY"
//   ) {
//     query.userId = user._id;
//   }

//   // TECHNICIAN
//   // Can only see tickets assigned to them
//   else if (user.role === "TECHNICIAN") {
//     query.technicianId = user._id;
//   }

//   // ADMIN
//   // No additional restriction
//   // Admin can see any ticket

//   const ticket = await Ticket.findOne(query)
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// };

// // Service :  Get ticket by ID ( admin use only )
// const getTicketById_forAdmin = async (ticketId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//   })
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// }; 

// // Service: Delete ticket
// const deleteTicketById = async (ticketId, userId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     return {
//       nonDeletable: true,
//       ticket,
//     };
//   }

//   // Delete Cloudinary image if it exists
//   if (ticket.imagePublicId) {
//     await deleteImage(ticket.imagePublicId);
//   }

//   await Ticket.deleteOne({
//     _id: ticketId,
//     userId,
//   });

//   await Activity.deleteMany({
//     ticketId: ticketId,
//   });

//   return {
//     nonDeletable: false,
//     ticket,
//   };
// };

// // Service : get all tickets ( admin use only )
// const getAllTickets = async () => {
//   const tickets = await Ticket.find()
//     .populate("userId", "name , email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email")
//     .sort({ createdAt: -1 });

//   return tickets;
// };

// // Service: Update ticket
// const updateTicketById = async (
//   ticketId,
//   userId,
//   updateData,
// ) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     throw apiError(
//       403,
//       "Ticket can only be updated while it is OPEN",
//     );
//   }

//   // Check department if department is being changed
//   if (updateData.departmentId) {
//     const department = await Department.findById(
//       updateData.departmentId,
//     );

//     if (!department) {
//       throw apiError(404, "Department not found");
//     }

//     if (!department.active) {
//       throw apiError(403, "Department is inactive");
//     }
//   }

//   Object.assign(ticket, updateData);

//   await ticket.save();

//   return ticket;
// }

// const updateTicketStatus = async (ticketId, status) => {
//   const allowedStatuses = [
//     "ASSIGNED",
//     "IN_PROGRESS",
//     "RESOLVED",
//   ];

//   if (!allowedStatuses.includes(status)) {
//     throw apiError(400, "Invalid ticket status");
//   }

//   const ticket = await Ticket.findById(ticketId);

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   ticket.status = status;

//   await ticket.save();

//   return await Ticket.findById(ticketId)
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone")
//     .populate("userId", "name email");
// };
// // Service: Update ticket image
// const updateTicketImage = async (
//   ticketId,
//   userId,
//   imageFile,
// ) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     throw apiError(
//       403,
//       "Ticket image can only be updated while it is OPEN",
//     );
//   }

//   if (!imageFile) {
//     throw apiError(400, "Image is required");
//   }

//   const oldImagePublicId = ticket.imagePublicId;

//   // Upload new image
//   const result = await uploadImage(imageFile.buffer);

//   ticket.imageUrl = result.secure_url;
//   ticket.imagePublicId = result.public_id;

//   await ticket.save();

//   // Delete old image
//   if (oldImagePublicId) {
//     await deleteImage(oldImagePublicId);
//   }

//   return ticket;
// };

// // Service: Get ticket for notification based on user's role
// const getTicketForNotification = async (
//   ticketId,
//   user,
// ) => {
//   const query = {
//     _id: ticketId,
//   };

//   // STUDENT / FACULTY
//   // Can open only their own ticket
//   if (
//     user.role === "STUDENT" ||
//     user.role === "FACULTY"
//   ) {
//     query.userId = user._id;
//   }

//   // TECHNICIAN
//   // Can open only tickets assigned to them
//   else if (user.role === "TECHNICIAN") {
//     query.technicianId = user._id;
//   }

//   // ADMIN
//   // Can open any ticket
//   // No extra filter needed

//   const ticket = await Ticket.findOne(query)
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone")
//     .lean();

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// };

// module.exports = {
//   createTicket,
//   getMyTickets,
//   getTicketById,
//   deleteTicketById,
//   updateTicketById,
//   updateTicketImage,
//   getAllTickets,
//   updateTicketStatus,
//   getTicketById_forAdmin,
//   getTicketForNotification,
//   getAssignedTickets,
//   getTechnicianHistory,
//   getTicketByIdForTechnician
// };


// const Department = require("../models/Department.model");
// const Ticket = require("../models/Ticket.model");
// const apiError = require("../utils/apiError");
// const uploadImage = require("../utils/uploadImage");
// const assignmentService = require("./assignment.service");
// const deleteImage = require("../utils/deleteImage");
// const notificationService = require("./notification.service");
// const activityService = require("./activity.service");
// const User = require("../models/user.model");
// const Activity = require("../models/Activity.model");
// const Technician = require("../models/Technician.model");

// // Service: Create ticket
// const createTicket = async (userId, ticketData, imageFile) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw apiError(404, "User not found");
//   }
//   const department = await Department.findById(ticketData.departmentId);

//   if (!department) {
//     throw apiError(404, "Department not found");
//   }

//   if (!department.active) {
//     throw apiError(403, "Department is inactive");
//   }

//   let imageUrl = null;
//   let imagePublicId = null;

//   if (imageFile) {
//     const result = await uploadImage(imageFile.buffer);

//     imageUrl = result.secure_url;
//     imagePublicId = result.public_id;
//   }

//   const ticket = await Ticket.create({
//     ...ticketData,
//     userId,
//     name: user.name,
//     imageUrl,
//     imagePublicId,
//     status: "OPEN",
//   });

//   // 2. Automatically assign technician
//   const assignment = await assignmentService.assignTechnician(
//   ticket._id,
//   ticket.departmentId
// );

// if (!assignment) {
//   ticket.status = "PENDING";
//   ticket.technicianId = null;
//   await ticket.save();
// }
//   // 3. Notify ticket creator
//   await notificationService.createNotification({
//     userId: ticket.userId,
//     ticketId: ticket._id,
//     type: "TICKET_CREATED",
//     message: `Your ticket "${ticket.title}" has been created successfully.`,
//   });

//   // 4. Find admin
//   const admin = await User.findOne({
//     role: "ADMIN",
//   });

//   // 5. Notify admin
//   if (admin) {
//     await notificationService.createNotification({
//       userId: admin._id,
//       ticketId: ticket._id,
//       type: "TICKET_CREATED",
//       message: `New ticket "${ticket.title}" has been created.`,
//     });
//   }

//   // 6. Create activity
//   await activityService.createActivity({
//     ticketId: ticket._id,
//     actorId: ticket.userId,
//     action: "TICKET_CREATED",
//     message: `You created ticket "${ticket.title}".`,
//   });

//   // 7. Fetch updated ticket after technician assignment
//   const updatedTicket = await Ticket.findById(ticket._id)
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone")
//     .populate("userId", "name email");

//   return updatedTicket;
// };

// // Service: Get my tickets
// const getMyTickets = async (userId) => {
//   const tickets = await Ticket.find({ userId })
//     .sort({ createdAt: -1 })
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!tickets || tickets.length === 0) {
//     throw apiError(404, "No tickets found");
//   }

//   return tickets;
// };
// // Service: Get assigned tickets for technician
// const getAssignedTickets = async (userId) => {
//   const technician = await Technician.findOne({
//     userId: userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const tickets = await Ticket.find({
//     technicianId: technician._id,
//   })
//     .sort({ createdAt: -1 })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   return tickets;
// };
// // Service: Get resolved tickets for technician
// const getTechnicianHistory = async (userId) => {
//   const technician = await Technician.findOne({
//     userId: userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const tickets = await Ticket.find({
//     technicianId: technician._id,
//     status: "RESOLVED",
//   })
//     .sort({ updatedAt: -1 })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   return tickets;
// };
// const getTicketByIdForTechnician = async (ticketId, userId) => {
//   const technician = await Technician.findOne({
//     userId,
//   });

//   if (!technician) {
//     throw apiError(404, "Technician profile not found");
//   }

//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     technicianId: technician._id,
//   })
//     .populate("userId", "name email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!ticket) {
//     throw apiError(404, "Ticket not found or not assigned to you");
//   }

//   return ticket;
// };
// // Service : get all tickets ( admin use only )
// const getAllTickets = async () => {
//   const tickets = await Ticket.find()
//     .populate("userId", "name , email")
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email")
//     .sort({ createdAt: -1 });

//   return tickets;
// };

// // Service: Get ticket by ID
// const getTicketById = async (ticketId, userId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   })
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// };

// // Service :  Get ticket by ID ( admin use only )
// const getTicketById_forAdmin = async (ticketId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//   })
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone");

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   return ticket;
// }; 

// // Service: Delete ticket
// const deleteTicketById = async (ticketId, userId) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     return {
//       nonDeletable: true,
//       ticket,
//     };
//   }

//   // Delete Cloudinary image if it exists
//   if (ticket.imagePublicId) {
//     await deleteImage(ticket.imagePublicId);
//   }

//   await Ticket.deleteOne({
//     _id: ticketId,
//     userId,
//   });

//   await Activity.deleteMany({
//     ticketId: ticketId,
//   });

//   return {
//     nonDeletable: false,
//     ticket,
//   };
// };

// // Service: Update ticket
// const updateTicketById = async (ticketId, userId, updateData) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     throw apiError(403, "Ticket can only be updated while it is OPEN");
//   }

//   // Check department if department is being changed
//   if (updateData.departmentId) {
//     const department = await Department.findById(updateData.departmentId);

//     if (!department) {
//       throw apiError(404, "Department not found");
//     }

//     if (!department.active) {
//       throw apiError(403, "Department is inactive");
//     }
//   }

//   Object.assign(ticket, updateData);

//   await ticket.save();

//   return ticket;
// };
// const updateTicketStatus = async (ticketId, status) => {
//   const allowedStatuses = [
//     "ASSIGNED",
//     "IN_PROGRESS",
//     "RESOLVED",
//   ];

//   if (!allowedStatuses.includes(status)) {
//     throw apiError(400, "Invalid ticket status");
//   }

//   const ticket = await Ticket.findById(ticketId);

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   ticket.status = status;

//   await ticket.save();

//   return await Ticket.findById(ticketId)
//     .populate("departmentId", "name")
//     .populate("technicianId", "name email phone")
//     .populate("userId", "name email");
// };
// // Service: Update ticket image
// const updateTicketImage = async (ticketId, userId, imageFile) => {
//   const ticket = await Ticket.findOne({
//     _id: ticketId,
//     userId,
//   });

//   if (!ticket) {
//     throw apiError(404, "Ticket not found");
//   }

//   if (ticket.status !== "OPEN") {
//     throw apiError(403, "Ticket image can only be updated while it is OPEN");
//   }

//   if (!imageFile) {
//     throw apiError(400, "Image is required");
//   }

//   const oldImagePublicId = ticket.imagePublicId;

//   // Upload new image
//   const result = await uploadImage(imageFile.buffer);

//   ticket.imageUrl = result.secure_url;
//   ticket.imagePublicId = result.public_id;

//   await ticket.save();

//   // Delete old image
//   if (oldImagePublicId) {
//     await deleteImage(oldImagePublicId);
//   }

//   return ticket;
// };

// module.exports = {
//   createTicket,
//   getMyTickets,
//   getTicketById,
//   deleteTicketById,
//   updateTicketById,
//   updateTicketImage,
//   getAllTickets,
//   updateTicketStatus,
//   getTicketById_forAdmin,
//   getAssignedTickets,
//   getTechnicianHistory,
//   getTicketByIdForTechnician
// };