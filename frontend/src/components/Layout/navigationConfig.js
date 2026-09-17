import {
  FiGrid,
  FiFileText,
  FiPlusCircle,
  FiShield,
  FiClock,
  FiUser,
  FiUsers,
  FiTool,
  FiBarChart2,
  FiLayers,
} from "react-icons/fi";


export const navigationConfig = {
  STUDENT: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
    },
    {
      label: "My Reports",
      path: "/issues",
      icon: FiFileText,
    },
    {
      label: "Report Issue",
      path: "/report-issue",
      icon: FiPlusCircle,
    },
    {
      label: "Safety",
      path: "/safety",
      icon: FiShield,
    },
    {
      label: "Activity",
      path: "/activity",
      icon: FiClock,
    },
  ],

  FACULTY: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
    },
    {
      label: "My Reports",
      path: "/issues",
      icon: FiFileText,
    },
    {
      label: "Report Issue",
      path: "/report-issue",
      icon: FiPlusCircle,
    },
    {
      label: "Safety",
      path: "/safety",
      icon: FiShield,
    },
    {
      label: "Activity",
      path: "/activity",
      icon: FiClock,
    },
  ],

  TECHNICIAN: [
    {
      label: "Dashboard",
      path: "/technician",
      icon: FiGrid,
    },
    {
      label: "Assigned Issues",
      path: "/technician/issues",
      icon: FiTool,
    },
    {
      label: "Resolution History",
      path: "/technician/history",
      icon: FiClock,
    },
    {
      label: "Activity",
      path: "/activity",
      icon: FiClock,
    },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      path: "/admin",
      icon: FiGrid,
    },
    {
      label: "All Issues",
      path: "/admin/issues",
      icon: FiFileText,
    },
    {
      label: "Technicians",
      path: "/admin/technicians",
      icon: FiUsers,
    },
    {
      label: "Departments",
      path: "/admin/departments",
      icon: FiLayers,
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: FiBarChart2,
    },
    {
      label: "Activity",
      path: "/activity",
      icon: FiClock,
    },
  ],
};


export const bottomNavigation = [
  {
    label: "Profile",
    path: "/profile",
    icon: FiUser,
  },
];