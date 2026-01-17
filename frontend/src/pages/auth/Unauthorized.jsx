// src/pages/auth/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/" className="mt-4 text-blue-600 underline">
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
