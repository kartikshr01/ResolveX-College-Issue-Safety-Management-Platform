const Technician = require("../models/Technician.model");
const Ticket = require("../models/Ticket.model");
const activityService=require("../services/activity.service");
const notificationService = require("../services/notification.service");
const findBestTechnician = async (departmentId) => {
  const technicians = await Technician.find({
    departmentId: departmentId,
    availability: true,
    status: "active",
  }).sort({
    currentWorkload: 1,
  });

  if (technicians.length === 0) {
    return null;
  }

  return technicians[0];
};

const assignTechnician = async (ticketId, departmentId) => {
  const technician = await findBestTechnician(departmentId);

  if (!technician) {
    return null;
  }

  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      technicianId: technician._id,
       status: "ASSIGNED",
    },
    {
      new: true,
    }
  );

  if (!ticket) {
    return null;
  }

  await Technician.findByIdAndUpdate(
    technician._id,
    {
      $inc: {
        currentWorkload: 1,
      },
    },
    
  );

   await notificationService.createNotification({
    userId: technician.userId,
    ticketId: ticket._id,
    type: "TICKET_ASSIGNED",
    message: `A new ticket "${ticket.title}" has been assigned to you.`,
  });
  await activityService.createActivity({
  ticketId: ticket._id,
  actorId: technician.userId,
  action: "TICKET_ASSIGNED",
  oldStatus: "OPEN",
  newStatus: "ASSIGNED",
  message: `Ticket "${ticket.title}" has been assigned to you.`,
});
  return {
    ticket,
    technician,
  };
};

module.exports = {
  findBestTechnician,
  assignTechnician,
};