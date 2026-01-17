import React, { useEffect, useState } from "react";
import { HomeIcon, UserGroupIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { fetchAllProperties, fetchAllUsers } from "../../api/admin";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [props, usrs] = await Promise.all([
          fetchAllProperties(),
          fetchAllUsers()
        ]);
        setProperties(props);
        setUsers(usrs.filter(u => u.role !== "admin")); // Hide admin users
      } catch (e) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Example: Show the 3 most recent properties as activity
  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <>
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        {error && <div className="text-red-500">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 rounded-lg p-6 flex items-center">
                <HomeIcon className="w-10 h-10 text-indigo-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{properties.length}</div>
                  <div className="text-gray-600">Total Properties</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 flex items-center">
                <UserGroupIcon className="w-10 h-10 text-green-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-gray-600">Total Users</div>
                </div>
              </div>
              {/* Add more cards as needed */}
            </div>

            {/* Recent Properties Activity */}
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h2>
                {recentProperties.length === 0 ? (
                  <div className="text-gray-500">No recent properties</div>
                ) : (
                  <ul>
                    {recentProperties.map((property) => (
                      <li key={property._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <span className="font-semibold">{property.title}</span> – {property.type} – ${property.price}
                        </div>
                        <button
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                          onClick={() => navigate(`/admin/property/${property._id}`)}
                        >View</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
