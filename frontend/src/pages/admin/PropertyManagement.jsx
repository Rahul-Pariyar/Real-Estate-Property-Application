import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  ListBulletIcon,
  Squares2X2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  TagIcon,
  PhotoIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { fetchAllProperties, deleteProperty } from "../../api/admin";
import axios from "axios";

const propertyTypes = [
  "All",
  "House",
  "Apartment",
  "Land",
  "Office",
];
const propertyStatus = ["All", "Active", "Pending", "Sold", "Rented"];

export default function PropertyManagement() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState("grid");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllProperties();
        setProperties(data);
      } catch (e) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesType =
      selectedType === "All" || property.type === selectedType;
    const matchesStatus =
      selectedStatus === "All" || property.status === selectedStatus;
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    setDeleting(id);
    await deleteProperty(id);
    setProperties(props => props.filter(p => p._id !== id));
    setDeleting("");
  };

  const handleEdit = (id) => {
    navigate(`/admin/properties/edit/${id}`);
  };

  // Toggle approval status
  const handleToggleStatus = async (id, status) => {
    // Defensive: Only allow toggling if status is Active or Pending
    if (status !== 'Active' && status !== 'Pending') return;
    const nextStatus = status === "Active" ? "Pending" : "Active";
    try {
      await axios.patch(`http://localhost:3000/property/status/${id}`, { status: nextStatus }, { withCredentials: true });
      setProperties((prev) => prev.map((p) => p._id === id ? { ...p, status: nextStatus } : p));
    } catch (e) {
      alert("Failed to update property status");
    }
  };

  // Reset filters and pagination
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1600px] mx-auto bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage and monitor all your property listings in one place.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/admin/properties/add")}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Property
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-100 p-4 rounded-lg lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-6">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">
                Search properties
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full px-4 py-3 text-base rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Search by title or location"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {propertyStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === "list"
                  ? "text-white bg-primary-600"
                  : "text-gray-500 hover:text-primary-600"
              }`}
            >
              <ListBulletIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === "grid"
                  ? "text-white bg-primary-600"
                  : "text-gray-500 hover:text-primary-600"
              }`}
            >
              <Squares2X2Icon className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={resetFilters}
            className="ml-4 px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>

        {/* Property List */}
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    className="bg-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={
                          property.images?.[0]
                            ? `http://localhost:3000/${property.images[0]}`
                            : "https://via.placeholder.com/80x80?text=No+Image"
                        }
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      {property.featured && (
                        <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm space-x-4">
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {property.location}
                          </span>
                          <span className="flex items-center">
                            <HomeIcon className="w-4 h-4 mr-1" />
                            {property.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary-600 font-semibold">
                          <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                          ${property.price}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : property.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : property.status === "Rented"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {property.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">{property.size}</div>
                        <div className="flex space-x-2">
                          {/* View Details */}
                          <button
                            onClick={() => navigate(`/admin/property/${property._id}`)}
                            className="p-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(property._id)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(property._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            disabled={deleting === property._id}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(property._id, property.status)}
                            className={`px-3 py-1 rounded text-white ${property.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}
                          >
                            {property.status === 'Active' ? 'Set Pending' : 'Approve'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedProperties.map((property) => (
                        <tr key={property._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {property.images && property.images.length > 0 ? (
                              <img src={`http://localhost:3000/${property.images[0]}`} alt={property.title} className="w-20 h-12 object-cover rounded" />
                            ) : (
                              <PhotoIcon className="w-8 h-8 text-gray-400" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {property.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <HomeIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {property.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-primary-600">
                              ${property.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {property.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                property.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : property.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : property.status === "Rented"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              {/* View Details */}
                              <button
                                onClick={() => navigate(`/admin/property/${property._id}`)}
                                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(property._id)}
                                className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(property._id)}
                                className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                                disabled={deleting === property._id}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                              <button
  onClick={() => (property.status === 'Active' || property.status === 'Pending') && handleToggleStatus(property._id, property.status)}
  className={`px-3 py-1 rounded text-white 
    ${(property.status === 'Active') ? 'bg-green-600' : (property.status === 'Pending' ? 'bg-gray-400' : 'bg-gray-300')} 
    ${(property.status === 'Sold' || property.status === 'Rented') ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={property.status !== 'Active' && property.status !== 'Pending'}
>
  {(property.status === 'Active') && 'Set Pending'}
  {(property.status === 'Pending') && 'Approve'}
  {(property.status === 'Sold') && 'Sold'}
  {(property.status === 'Rented') && 'Rented'}
</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center py-4">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
                  <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
