import React from "react";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PrivateRoute from "../components/auth/PrivateRoute";
import PropertyManagement from "../pages/admin/PropertyManagement";
import AddProperty from "../pages/admin/AddProperty";
import UserManagement from "../pages/admin/UserMangement";
import AddUser from "../pages/admin/AddUser";
import Notifications from "../pages/admin/Notifications";
import EditProperty from "../pages/admin/EditProperty";
import EditUser from "../pages/admin/EditUser";
import Contacts from "../pages/admin/Contacts"; 
import AdminProfile from "../pages/admin/AdminProfile";
import AdminPropertyDetails from "../pages/admin/AdminPropertyDetails";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <PrivateRoute requiredRole={"admin"}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "properties",
        element: <PropertyManagement />,
      },
      {
        path: "properties/edit/:id",
        element: <EditProperty />,
      },
      {
        path: "properties/add",
        element: <AddProperty />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "users/add",
        element: <AddUser />,
      },
      {
        path: "users/edit/:id",
        element: <EditUser />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "property/:id",
        element: <AdminPropertyDetails />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
    ],
  },
];

export default adminRoutes;
