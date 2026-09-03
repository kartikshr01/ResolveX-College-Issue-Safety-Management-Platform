import {
FiGrid,
FiPlusCircle,
FiFileText,
FiShield,
FiClock,
FiUser,
} from "react-icons/fi";

export const userNavigation = [
{
label: "Dashboard",
path: "/dashboard",
icon: FiGrid,
},

{
label: "Report Issue",
path: "/report-issue",
icon: FiPlusCircle,
},

{
label: "My Issues",
path: "/my-issues",
icon: FiFileText,
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
];

export const bottomNavigation = [
{
label: "Profile",
path: "/profile",
icon: FiUser,
},
];