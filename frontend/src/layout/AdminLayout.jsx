import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { UserIcon as ProfileUserIcon } from "@heroicons/react/24/outline";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../features/auth/authActions";
import axios from "axios";

// Navigation data
const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Notifications", href: "/admin/notifications", icon: BellIcon },
  {
    name: "Properties",
    href: "/admin/properties",
    icon: BuildingOfficeIcon,
    subItems: [
      { name: "All Properties", href: "/admin/properties" },
      { name: "Add Property", href: "/admin/properties/add" },
    ],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UsersIcon,
    subItems: [
      { name: "All Users", href: "/admin/users" },
      { name: "Add User", href: "/admin/users/add" },
    ],
  },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: ChatBubbleLeftEllipsisIcon,
  },
  // { name: "Statistics", href: "/admin/statistics", icon: ChartBarIcon },
  // { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function MainLayout() {
  const dispatch = useDispatch();
  const fullName = useSelector((state) => state.auth.fullName) || "Admin";
  const email = useSelector((state) => state.auth.email) || "";

  const handleLogOut = () => {
    setProfileOpen(false);
    dispatch(userLogout());
  };

  const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar visibility
  const [expandedItem, setExpandedItem] = useState(null); // State for expanded menu item
  const [profileOpen, setProfileOpen] = useState(false); // State for profile dropdown visibility
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const location = useLocation(); // Get current route location
  const navigate = useNavigate(); // Navigation function

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notification", { withCredentials: true });
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle expanded state for menu items
  const toggleExpand = (itemName) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  // Handle navigation for menu items
  const handleNavigation = (item) => {
    if (item.subItems) {
      toggleExpand(item.name); // Expand/collapse sub-items
    } else {
      navigate(item.href); // Navigate to the link
      setSidebarOpen(false); // Close sidebar on mobile
    }
  };

  // Close profile dropdown when clicking outside
  const closeProfileDropdown = (e) => {
    if (!e.target.closest(".profile-dropdown")) {
      setProfileOpen(false);
    }
  };

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    if (profileOpen) {
      document.addEventListener("click", closeProfileDropdown);
    }
    return () => {
      document.removeEventListener("click", closeProfileDropdown);
    };
  }, [profileOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <button
            className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={toggleSidebar}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.subItems &&
                item.subItems.some((sub) => location.pathname === sub.href));
            const isExpanded = expandedItem === item.name;

            return (
              <div key={item.name} className="relative">
                {/* Main menu item */}
                <button
                  onClick={() => handleNavigation(item)}
                  className={`flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all w-full ${
                    isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.name === "Notifications" && unreadCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2">
                      {unreadCount}
                    </span>
                  )}
                  {item.subItems && (
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Sub-items */}
                {item.subItems && isExpanded && (
                  <div className="ml-6 space-y-1 overflow-hidden transition-all duration-200">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`block text-sm py-2 px-6 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all ${
                          location.pathname === subItem.href
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : ""
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:pl-72" : "pl-0"
        } min-h-screen`}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          {/* Navbar Left */}
          <div className="flex items-center">
            <button
              className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg hidden lg:block"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          {/* Navbar Right - Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {/* <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                /> */}
                <ProfileUserIcon className="h-8 w-8 text-gray-200 bg-black rounded-2xl " />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-gray-800">
                    {fullName}
                  </div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <svg
                  className={`hidden md:block w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Enhanced Dropdown Menu */}
              {profileOpen && (
                <div
                  className={`absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 transition-all duration-200 origin-top-right transform ${
                    profileOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {/* <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      /> */}

                      <ProfileUserIcon className="h-8 w-8 text-gray-200 bg-black rounded-2xl " />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {fullName}
                        </div>
                        <div className="text-xs text-gray-500">{email}</div>
                        {/* <div className="text-xs text-primary-600 font-medium">
                          Administrator
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7V7a7 7 0 00-7-7H6a7 7 0 00-7 7v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Your Profile
                    </Link>
                    {/* <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link> */}
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
