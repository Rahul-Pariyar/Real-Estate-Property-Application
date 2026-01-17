import React from "react";
import PublicLayout from "../layout/PublicLayout";
import Home from "../pages/general/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Unauthorized from "../pages/auth/Unauthorized";
import About from "../pages/general/About";
import Contact from "../pages/general/Contact";
import AllProperties from "../pages/general/AllProperties";
import PropertyDetails from "../pages/general/PropertyDetails";

const publicRoutes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true, // This makes "/" route point to Home component
        element: <Home />,
      },
      {
        path: "login", // Avoid duplicate path
        element: <Login />,
      },
      {
        path: "signup", // Corrected path for Signup
        element: <Signup />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "allproperties",
        element: <AllProperties />,
      },
      {
        path: "property/:id",
        element: <PropertyDetails />,
      },
    ],
  },
];

export default publicRoutes;
