import React, { useEffect, useState } from "react";
import { UserIcon as ProfileUserIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { fetchAllUsers, deleteUser } from "../../api/admin";

const roles = ["All", "admin", "buyer", "seller"];
const statuses = ["All", "Active", "Inactive"];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reset filters and pagination
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("All");
    setCurrentPage(1);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllUsers();
        setUsers(data.filter(u => u.role !== "admin"));
      } catch (e) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    // Optionally, add status filter if you have status in user data
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your team members and their account permissions here.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/admin/users/add")}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-100 p-4 rounded-lg lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-6">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">
                Search users
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full px-4 py-3 text-base rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:w-48">
              <select
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="ml-4 px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>

        {/* User List */}
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-gray-100 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {/* <img
                            src={user.avatar || "https://via.placeholder.com/80x80?text=No+Image"}
                            alt="images"
                            className="h-12 w-12 rounded-md object-cover"
                          /> */}
                          <ProfileUserIcon className="h-8 w-8 text-zinc-900 bg-gray-400 rounded-2xl mt-2 " />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                          className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center py-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
