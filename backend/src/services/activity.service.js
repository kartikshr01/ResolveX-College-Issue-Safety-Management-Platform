const Activity = require("../models/activity.model");

const createActivity = async ({
  ticketId,
  actorId,
  action,
  oldStatus = null,
  newStatus = null,
  message,
}) => {
  const activity = await Activity.create({
    ticketId,
    actorId,
    action,
    oldStatus,
    newStatus,
    message,
  });

  return activity;
};

const getMyActivities = async (userId) => {
  const activities = await Activity.find({
    actorId: userId,
  })
    .populate("ticketId", "title category status")
    .sort({ createdAt: -1 })
    .lean();

  return activities;
};

const getTicketActivities = async (ticketId) => {
  const activities = await Activity.find({
    ticketId,
  })
    .populate("actorId", "fname lname")
    .sort({ createdAt: 1 })
    .lean();

  return activities;
};

module.exports = {
  createActivity,
  getMyActivities,
  getTicketActivities,
};