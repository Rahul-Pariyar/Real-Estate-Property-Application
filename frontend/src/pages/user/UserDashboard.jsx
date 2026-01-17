// // import React, { useState } from "react";
// // import Navbar from "../../components/user/Navbar";
// // import Sidebar from "../../components/user/Sidebar";

// // const UserDashboard = () => {
// //   const [sidebarOpen, setSidebarOpen] = useState(true);
// //   return (
// //     <div>
// //       <Navbar setSidebarOpen={setSidebarOpen} />
// //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
// //     </div>
// //   );
// // };

// // export default UserDashboard;

// import { useState } from "react";
// import Navbar from "../../components/user/Navbar";
// import Sidebar from "../../components/user/Sidebar";
// import PropertyList from "../../components/user/PropertyList";
// import PropertyForm from "../../components/user/PropertyForm";

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showPropertyForm, setShowPropertyForm] = useState(false);
//   const [properties, setProperties] = useState([]);

//   const fetchProperties = async () => {
//     // TODO: Fetch user's properties from backend API
//     // setProperties(response.data);
//   };

//   const handlePropertySubmit = () => {
//     setShowPropertyForm(false);
//     fetchProperties();
//   };

//   const handlePropertyEdit = (property) => {
//     console.log("Edit property:", property);
//     // Handle property edit here
//   };

//   const handlePropertyDelete = (propertyId) => {
//     setProperties(properties.filter((property) => property.id !== propertyId));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar setSidebarOpen={setSidebarOpen} />
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="p-4 lg:ml-64 pt-20">
//         <div className="mb-4">
//           <button
//             onClick={() => setShowPropertyForm(true)}
//             className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//           >
//             Add Property
//           </button>
//         </div>

//         <PropertyList
//           properties={properties}
//           onEdit={handlePropertyEdit}
//           onDelete={handlePropertyDelete}
//         />

//         <PropertyForm
//           isOpen={showPropertyForm}
//           onClose={() => setShowPropertyForm(false)}
//           onSubmit={handlePropertySubmit}
//         />
//       </div>
//     </div>
//   );
// }

// export default App;
