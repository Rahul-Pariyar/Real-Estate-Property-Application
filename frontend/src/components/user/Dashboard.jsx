import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const { isLogged, role, initialized, fullName, email, phone, id } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [propertyStats, setPropertyStats] = useState({ total: 0, active: 0, pending: 0 });

  useEffect(() => {
    // Wait for auth check to complete
    if (!initialized) return;
    // If not logged in or not the right role, go to login
    if (!isLogged || (role !== "seller" && role !== "buyer")) {
      navigate("/login");
    }
  }, [isLogged, role, initialized, navigate]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get("http://localhost:3000/property/getAll", { withCredentials: true });
        const props = res.data || [];
        // Only include properties added by the currently logged-in user
        const userId = id;
        const userProps = props.filter(p => p.owner === userId);
        setPropertyStats({
          total: userProps.length,
          active: userProps.filter(p => p.status === "Active").length,
          pending: userProps.filter(p => p.status === "Pending").length,
        });
      } catch {
        setPropertyStats({ total: 0, active: 0, pending: 0 });
      }
    }
    fetchStats();
  }, [id]);

  // Optionally show loading while waiting for auth check
  if (!initialized) {
    return (
      <div className="w-full flex justify-center items-center py-20 text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center md:text-left">Welcome, {fullName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Total Properties</p>
          <p className="text-2xl font-bold text-indigo-700">{propertyStats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Active Properties</p>
          <p className="text-2xl font-bold text-green-600">{propertyStats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Pending Properties</p>
          <p className="text-2xl font-bold text-yellow-600">{propertyStats.pending}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <button onClick={() => navigate("/user/properties")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          View My Properties
        </button>
        <button onClick={() => navigate("/user/add-property")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Add New Property
        </button>
      </div>
    </div>
  );
}
