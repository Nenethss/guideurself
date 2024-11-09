import { MdDashboard } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { FaSchoolFlag } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const TABS_INFO = [
  {
    name: "Main",
    tabs: [
      {
        name: "Dashboard",
        route: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        name: "Documents",
        route: "/documents",
        icon: <FaFolder />,
      },
      {
        name: "Virtual Tour",
        route: "/virtual-tour",
        icon: <IoLocationSharp />,
      },
      {
        name: "Reports",
        route: "/reports",
        icon: <BiSolidReport />,
      },
    ],
  },
  {
    name: "University Management",
    tabs: [
      {
        name: "Campus",
        route: "/campus",
        icon: <FaSchoolFlag />,
      },
    ],
  },
  {
    name: "User Management",
    tabs: [
      {
        name: "Accounts",
        route: "/accounts",
        icon: <IoPersonSharp />,
      },
      {
        name: "Roles and Permissions",
        route: "/roles-and-permissions",
        icon: <MdPeopleAlt />,
      },
    ],
  },
  {
    name: "Others",
    tabs: [
      {
        name: "Settings",
        route: "/settings",
        icon: <IoIosSettings />,
      },
    ],
  },
];

export default TABS_INFO;
