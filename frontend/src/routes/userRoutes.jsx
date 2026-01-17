import React from "react";
import UserLayout from "../layout/UserLayout";
// import UserDashboard from "../pages/user/UserDashboard";
import PrivateRoute from "../components/auth/PrivateRoute";
import Dashboard from "../components/user/Dashboard";
import AddProperty from "../components/user/AddProperty";
import AllProperties from "../components/user/AllProperties";
import ErrorPage from "../components/user/ErrorPage";
import Profile from "../components/user/Profile";

const userRoutes = [
  {
    path: "/user",
    element: (
      <PrivateRoute requiredRole={["seller", "admin"]}>
        <UserLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />, // Enable friendly error handling for user routes
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "add-property",
        element: <AddProperty />,
      },
      {
        path: "properties",
        element: <AllProperties />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];

export default userRoutes;
