import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../features/auth/authActions.js";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogged, role } = useSelector((state) => state.auth);

  // Determine dashboard path and nav visibility based on role
  let dashboardPath = null;
  let showUserDashboard = false;
  let showAdminDashboard = false;
  if (isLogged && role === "seller") {
    dashboardPath = "/user";
    showUserDashboard = true;
  } else if (isLogged && role === "admin") {
    dashboardPath = "/admin";
    showAdminDashboard = true;
  }

  const NAV_ITEMS = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Properties", path: "/allproperties" },
    { name: "Contact", path: "/contact" },
    ...(showUserDashboard ? [{ name: "Dashboard", path: dashboardPath }] : []),
    ...(showAdminDashboard ? [{ name: "Admin", path: dashboardPath }] : [])
  ];

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/login");
  };

  return (
    <header className="w-full overflow-x-hidden bg-[rgba(76,74,82,1)] shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 flex justify-between items-center h-16">
        {/* Brand/Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="logo cursor-pointer h-10 w-auto sm:h-12 drop-shadow-lg transition-transform duration-200 hover:scale-105 object-contain max-w-full"
          style={{ maxWidth: '120px' }}
          onClick={() => navigate("/")}
        />
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-7 items-center">
          {NAV_ITEMS.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `cursor-pointer px-3 py-2 rounded-lg font-medium transition-all duration-200 underline-effect relative 
                  ${isActive ? "text-white font-semibold underline-effect-active" : "text-gray-200 hover:text-white"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </NavLink>
            </li>
          ))}
          {isLogged ? (
            <li>
              <button
                onClick={handleLogout}
                className="text-gray-100 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm active:scale-95 focus:outline-none"
                style={{ background: "none", border: "none" }}
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink
                  to="/signup"
                  className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-md transition-all duration-200 transform hover:scale-105 hover:from-blue-500 hover:to-green-400 focus:outline-none active:scale-95"
                >
                  Signup
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="inline-block px-5 py-2 rounded-full border-2 border-white text-white font-semibold shadow-md bg-transparent transition-all duration-200 transform hover:scale-105 hover:bg-white hover:text-sky-700 focus:outline-none active:scale-95"
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center text-white hover:text-sky-300 focus:outline-none transition-transform duration-200 ml-2 p-2 rounded-lg"
          style={{ minWidth: '44px', minHeight: '44px' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="material-icons text-4xl">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 w-full overflow-x-hidden bg-[rgba(76,74,82,0.97)] backdrop-blur-sm flex flex-col md:hidden animate-fade-in-down">
          <div className="flex justify-end p-4">
            <button
              className="text-white text-3xl focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <ul className="flex flex-col items-center gap-8 py-8 flex-1 w-full">
            {NAV_ITEMS.map(({ name, path }) => (
              <li key={name} className="w-full">
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `block w-full text-center px-4 py-3 text-lg rounded-lg font-medium transition-all duration-200 underline-effect relative 
                    ${isActive ? "text-white font-semibold underline-effect-active" : "text-gray-200 hover:text-white"}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </NavLink>
              </li>
            ))}
            {isLogged ? (
              <li className="w-full">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-3 rounded-lg font-semibold text-gray-100 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 shadow-sm transition-all duration-200 active:scale-95 focus:outline-none"
                  style={{ background: "none", border: "none" }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="w-full">
                  <NavLink
                    to="/signup"
                    className="block w-full text-center px-4 py-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-md transition-all duration-200 transform hover:scale-105 hover:from-blue-500 hover:to-green-400 focus:outline-none active:scale-95"
                    onClick={() => setMenuOpen(false)}
                  >
                    Signup
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-full border-2 border-white text-white font-semibold shadow-md bg-transparent transition-all duration-200 transform hover:scale-105 hover:bg-white hover:text-sky-700 focus:outline-none active:scale-95"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
