const Ticket = require("../models/Ticket.model");
const Technician = require("../models/Technician.model");
const User = require("../models/user.model");
const Department = require("../models/Department.model");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");

// Get system statistics
const getSystemStatistics = async () => {
  const [statusStats, departmentStats, priorityStats, technicianWorkloadStats] =
    await Promise.all([
      // Ticket count by status
      Ticket.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      // Ticket count by department
      Ticket.aggregate([
        {
          $group: {
            _id: "$departmentId",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $project: {
            _id: 0,
            departmentId: "$department._id",
            departmentName: "$department.name",
            count: 1,
          },
        },
        {
          $sort: {
            departmentName: 1,
          },
        },
      ]),

      // Ticket count by priority
      Ticket.aggregate([
        {
          $group: {
            _id: "$priority",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      // Technician workload statistics
      Technician.find(
        {},
        {
          name: 1,
          email: 1,
          departmentId: 1,
          availability: 1,
          status: 1,
          currentWorkload: 1,
        },
      )
        .populate("departmentId", "name")
        .sort({ currentWorkload: -1 })
        .lean(),
    ]);

  return {
    statusBreakdown: statusStats,
    departmentBreakdown: departmentStats,
    priorityBreakdown: priorityStats,
    technicianWorkload: technicianWorkloadStats,
  };
};

// Get all technicians
const getAllTechnicians = async () => {
  return await Technician.find()
    .populate("userId", "name email active role")
    .populate("departmentId", "name")
    .sort({ createdAt: -1 });
};

// Create new technician
const createTechnician = async (techData) => {
  const { name, email, password, phone, departmentId, skills } = techData;

  // Check department
  const department = await Department.findById(departmentId);

  if (!department) {
    throw ApiError(404, "Department not found");
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw  ApiError(400, "User with this email already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user account
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "TECHNICIAN",
    departmentId,
    active: true,
  });

  try {
    // Create technician profile
    const technician = await Technician.create({
      userId: user._id,
      name,
      email,
      phone,
      departmentId,
      skills: skills || [],
      availability: true,
      currentWorkload: 0,
      status: "active",
    });

    return technician;
  } catch (error) {
    // Rollback user if technician creation fails
    await User.findByIdAndDelete(user._id);

    throw error;
  }
};

// Update technician / Convert existing student to technician
const updateTechnician = async (userId, updateData) => {
  // Find user
  const user = await User.findById(userId);

  if (!user) {
    throw  ApiError(404, "User not found");
  }

  // Only STUDENT or TECHNICIAN can be handled here
  if (user.role !== "STUDENT" && user.role !== "TECHNICIAN") {
    throw  ApiError(
      400,
      "Only student users can be converted to technician or existing technicians can be updated",
    );
  }

  // Validate department if provided
  if (updateData.departmentId !== undefined) {
    const department = await Department.findById(updateData.departmentId);

    if (!department) {
      throw  ApiError(404, "Department not found");
    }
  }

  // Student → Technician
  if (user.role === "STUDENT") {
    if (!updateData.departmentId) {
      throw  ApiError(
        400,
        "Department is required when converting a student to technician",
      );
    }

    if (updateData.phone === undefined) {
      throw  ApiError(
        400,
        "Phone number is required when converting a student to technician",
      );
    }

    const previousRole = user.role;
    const previousActive = user.active;
    const previousDepartmentId = user.departmentId;

    try {
      // Update User
      user.role = "TECHNICIAN";
      user.active = true;
      user.departmentId = updateData.departmentId;

      await user.save();

      // Create Technician profile
      const technician = await Technician.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: updateData.phone,
        departmentId: updateData.departmentId,
        skills: updateData.skills || [],
        availability:
          updateData.availability !== undefined
            ? updateData.availability
            : true,
        currentWorkload: 0,
        status: updateData.status !== undefined ? updateData.status : "active",
      });

      return technician;
    } catch (error) {
      // Rollback User conversion if Technician creation fails
      user.role = previousRole;
      user.active = previousActive;
      user.departmentId = previousDepartmentId;

      await user.save();

      throw error;
    }
  }

  // Existing TECHNICIAN update
  const technician = await Technician.findOne({
    userId: user._id,
  });

  if (!technician) {
    throw  ApiError(404, "Technician profile not found");
  }

  // Fields Admin can update
  const allowedFields = [
    "phone",
    "departmentId",
    "skills",
    "availability",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      technician[field] = updateData[field];
    }
  });

  await technician.save();

  // Keep User account synchronized
  const userUpdate = {};

  if (updateData.status === "inactive") {
    userUpdate.active = false;
  }

  if (updateData.status === "active") {
    userUpdate.active = true;
  }

  if (updateData.departmentId !== undefined) {
    userUpdate.departmentId = updateData.departmentId;
  }

  if (Object.keys(userUpdate).length > 0) {
    await User.findByIdAndUpdate(technician.userId, userUpdate, { new: true });
  }

  return technician;
};

const getDepartments = async () => {
  return await Department.find({ active: true })
    .select("_id name")
    .sort({ name: 1 });
};

module.exports = {
  getSystemStatistics,
  createTechnician,
  getAllTechnicians,
  updateTechnician,
  getDepartments,
};
