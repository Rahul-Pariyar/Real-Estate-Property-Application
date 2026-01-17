// import { useState } from 'react';
// import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
// import { useSelector } from "react-redux";

// export default function Navbar() {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const notifications = [
//     { id: 1, text: "New property listed!", time: "2h ago" },
//     { id: 2, text: "You have a new message.", time: "1h ago" },
//   ];

//   const { fullName } = useSelector((state) => state.auth);

//   const handleLogout = () => {
//     window.location.href = "/login";
//   };

//   return (
//     <div className="bg-white shadow-sm w-full">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-16 py-4 sm:py-0 gap-2 sm:gap-0">
//           <div className="flex items-center w-full sm:w-auto">
//             <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate max-w-[65vw]">Welcome{fullName ? `, ${fullName}` : ", User"}</h1>
//           </div>
//           <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0">
//             <div className="relative">
//               <button
//                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//               >
//                 <UserCircleIcon className="h-8 w-8" />
//                 <span className="hidden md:block">Profile</span>
//                 <ChevronDownIcon className={`h-4 w-4 transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 transform opacity-100 scale-100 transition-all duration-200">
//                   <a
//                     href="#"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Your Profile
//                   </a>
//                   <a
//                     href="#"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Log out
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userLogout } from "../../features/auth/authActions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifications = [
    { id: 1, text: "New property listed!", time: "2h ago" },
    { id: 2, text: "You have a new message.", time: "1h ago" },
  ];

  const { fullName } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-16 py-4 sm:py-0 gap-2 sm:gap-0">
          <div className="flex items-center w-full sm:w-auto">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate max-w-[65vw]">
              Welcome{fullName ? `, ${fullName}` : ", User"}
            </h1>
          </div>
          <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircleIcon className="h-8 w-8" />
                <span className="hidden md:block">Profile</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 transform opacity-100 scale-100 transition-all duration-200">
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Log out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
