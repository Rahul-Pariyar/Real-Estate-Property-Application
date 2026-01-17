import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  BuildingOffice2Icon,
  ArrowUturnLeftIcon 
} from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";

import { userLogout } from "../../features/auth/authActions";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/user" },
  { name: "Profile", icon: UserIcon, path: "/user/profile" },
];

const propertyItems = [
  { name: "Add Property", icon: PlusCircleIcon, path: "/user/add-property" },
  {
    name: "All Properties",
    icon: BuildingOffice2Icon,
    path: "/user/properties",
  },
  
];

const backToHomeItems = [
  { name: "Back To Home", icon: ArrowUturnLeftIcon, path: "/" },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLogged, role, initialized } = useSelector((state) => state.auth);

  // Only render sidebar if not buyer
  if (role === 'buyer') return null;

  const handleLogOut = () => {
    dispatch(userLogout());
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    if (currentItem) {
      setActiveItem(currentItem.name);
    } else {
      const propertyItem = propertyItems.find(
        (item) => item.path === location.pathname
      );
      if (propertyItem) {
        setActiveItem(propertyItem.name);
      }
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const togglePropertyDropdown = () => {
    setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
  };

  const handlePropertyItemClick = (itemName) => {
    setActiveItem(itemName);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const sidebarClasses = `${
    isMobile
      ? `fixed inset-y-0 left-0 z-30 w-64 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`
      : "relative w-64"
  } bg-gray-800 text-white p-4 transition-transform duration-300 ease-in-out`;

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 right-4 z-40 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      )}

      {/* Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={sidebarClasses}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">User Dashboard</h2>
        </div>

        <nav className="space-y-2">
          {/* Regular Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                activeItem === item.name
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => {
                if (isMobile) setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Property Dropdown */}
          <div className="relative">
            <button
              onClick={togglePropertyDropdown}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 ${
                propertyItems.some((item) => activeItem === item.name)
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-6 w-6" />
                <span>Property</span>
              </div>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isPropertyDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`mt-1 space-y-1 overflow-hidden transition-all duration-200 ${
                isPropertyDropdownOpen
                  ? "max-h-48 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {propertyItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handlePropertyItemClick(item.name)}
                  className={`flex items-center space-x-3 w-full p-3 pl-6 rounded-lg transition-all duration-200 ${
                    activeItem === item.name
                      ? "bg-indigo-600/75 text-white"
                      : "text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Back to Home button */}
        <div className="mt-2">
          {backToHomeItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4">
          <button
            onClick={handleLogOut}
            className="flex items-center space-x-3 text-gray-300 hover:text-white p-3 transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
