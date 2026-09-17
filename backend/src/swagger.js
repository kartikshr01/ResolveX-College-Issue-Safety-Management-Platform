const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
});

const doc = {
  info: {
    title: "ResolveX - College Safety API",
    description:
      "Auto-generated API documentation for the ResolveX College Safety and Issue Reporting System.",
    version: "1.0.0",
  },

  servers: [
    {
      url: process.env.FRONTEND_URL?.replace(/\/login\/?$/, ""),
      description: "Production Server",
    },
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Local Development Server",
    },
  ],
tags: [
    {
      name: "Technicians",
      description: "Technician management and technician-related APIs",
    },
    {
      name: "Activity",
      description: "User and system activity APIs",
    },
    {
      name: "Issues",
      description: "College safety issue APIs",
    },
    {
      name: "Notifications",
      description: "Notification APIs",
    },
    {
      name: "Auth",
      description: "Authentication and authorization APIs",
    },
    {
      name: "Users",
      description: "User management APIs",
    },
    {
      name: "Tickets",
      description: "Ticket management APIs",
    },
    {
      name: "Admin",
      description: "Administrator APIs",
    },
    {
      name: "Assignments",
      description: "Technician assignment APIs",
    },
  ],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },

    schemas: {
      // =========================
      // AUTH
      // =========================

      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "student@gmail.com",
          },
          password: {
            type: "string",
            minLength: 8,
            example: "12345678",
          },
        },
      },

      RegisterBody: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            example: "Student Name",
          },
          email: {
            type: "string",
            format: "email",
            minLength: 8,
            maxLength: 100,
            example: "student@gmail.com",
          },
          password: {
            type: "string",
            minLength: 8,
            example: "12345678",
          },
        },
      },

      // =========================
      // ADMIN - CREATE TECHNICIAN
      // =========================

      CreateTechnicianBody: {
        type: "object",
        required: [
          "name",
          "email",
          "password",
          "phone",
          "departmentId",
        ],
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 50,
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@gmail.com",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "123456",
          },
          phone: {
            type: "integer",
            minimum: 1000000000,
            maximum: 9999999999,
            example: 9876543210,
          },
          departmentId: {
            type: "string",
            minLength: 24,
            maxLength: 24,
            example: "64f123456789abcdef123456",
          },
          skills: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["Electrical", "Wiring"],
          },
        },
      },

      // =========================
      // ADMIN - UPDATE TECHNICIAN
      // =========================

      UpdateTechnicianBody: {
        type: "object",
        properties: {
          departmentId: {
            type: "string",
            minLength: 24,
            maxLength: 24,
            example: "64f123456789abcdef123456",
          },
          phone: {
            type: "integer",
            minimum: 1000000000,
            maximum: 9999999999,
            example: 9876543210,
          },
          skills: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["Electrical", "Wiring"],
          },
          availability: {
            type: "boolean",
            example: true,
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },

      // =========================
      // TECHNICIAN
      // =========================

      TechnicianBody: {
        type: "object",
        required: [
          "userId",
          "name",
          "email",
          "phone",
          "departmentId",
        ],
        properties: {
          userId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@gmail.com",
          },
          phone: {
            type: "string",
            example: "9876543210",
          },
          departmentId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          skills: {
            type: "array",
            items: {
              type: "string",
            },
            default: [],
            example: ["Electrical", "Wiring"],
          },
          availability: {
            type: "boolean",
            default: true,
            example: true,
          },
          currentWorkload: {
            type: "number",
            minimum: 0,
            default: 0,
            example: 2,
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            default: "active",
            example: "active",
          },
        },
      },

      // =========================
      // TICKET - CREATE
      // =========================

      CreateTicketBody: {
        type: "object",
        required: [
          "title",
          "description",
          "departmentId",
          "category",
          "location",
          "priority",
        ],
        properties: {
          title: {
            type: "string",
            minLength: 5,
            maxLength: 150,
            example: "Open wiring in corridor",
          },
          description: {
            type: "string",
            minLength: 10,
            maxLength: 2000,
            example:
              "There is exposed wiring in the corridor on the second floor.",
          },
          departmentId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          category: {
            type: "string",
            example: "Electrical",
          },
          location: {
            type: "string",
            maxLength: 200,
            example: "2nd Floor, B Wing",
          },
          priority: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            example: "CRITICAL",
          },
          safetyFlag: {
            type: "boolean",
            default: false,
            example: false,
          },
          name: {
            type: "string",
            example: "Student Name",
          },
        },
      },

      // =========================
      // TICKET - UPDATE
      // =========================

      UpdateTicketBody: {
        type: "object",
        properties: {
          title: {
            type: "string",
            minLength: 5,
            maxLength: 150,
            example: "Updated wiring issue",
          },
          description: {
            type: "string",
            minLength: 10,
            maxLength: 2000,
            example: "Updated description of the safety issue.",
          },
          category: {
            type: "string",
            example: "Electrical",
          },
          location: {
            type: "string",
            maxLength: 200,
            example: "2nd Floor, B Wing",
          },
          priority: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            example: "HIGH",
          },
          safetyFlag: {
            type: "boolean",
            example: true,
          },
          departmentId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          name: {
            type: "string",
            example: "Student Name",
          },
        },
      },

      // =========================
      // ASSIGNMENT
      // =========================

      AssignTechnicianBody: {
        type: "object",
        required: ["technicianId"],
        properties: {
          technicianId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
        },
      },

      // =========================
      // USER PROFILE
      // =========================

      UpdateProfileBody: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            example: "Student Name",
          },
          email: {
            type: "string",
            format: "email",
            minLength: 8,
            maxLength: 100,
            example: "student@gmail.com",
          },
        },
      },
    },
  },
};

const outputFile = "./src/swagger-output.json";

const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);