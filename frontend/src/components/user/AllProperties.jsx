import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const statusColors = {
  Active: "text-green-700 bg-green-50 ring-green-600/20",
  Pending: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
  Sold: "text-red-700 bg-red-50 ring-red-600/20",
  Rented: "text-blue-700 bg-blue-50 ring-blue-600/20",
};

export default function AllProperties() {
  const { isLogged, id: userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) navigate("/login");
  }, [isLogged, navigate]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [editingProperty, setEditingProperty] = useState(null);
  const [properties, setProperties] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      sizeUnit: "sqft",
      amenities: [],
      price: "",
      type: "",
    },
  });

  const propertyType = watch("type");
  const isLandType = propertyType === "Land";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/property/getAll",
          {
            withCredentials: true,
          }
        );
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Only show properties owned by the logged-in user
  const filteredByOwner = properties.filter(
    (property) => property.owner === userId
  );

  const filteredProperties = filteredByOwner.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || property.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleCardExpansion = (propertyId) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(propertyId)) {
      newExpandedCards.delete(propertyId);
    } else {
      newExpandedCards.add(propertyId);
    }
    setExpandedCards(newExpandedCards);
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    Object.keys(property).forEach((key) => {
      if (
        key !== "_id" &&
        key !== "images" &&
        key !== "createdAt" &&
        key !== "updatedAt" &&
        key !== "__v"
      ) {
        setValue(key, property[key]);
      }
    });
  };

  const closeEditModal = () => {
    setEditingProperty(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!window.confirm('Are you sure you want to save these changes?')) return;
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "images") {
          for (let i = 0; i < data.images.length; i++) {
            formData.append("images", data.images[i]);
          }
        } else {
          formData.append(key, data[key]);
        }
      }
      const response = await axios.put(
        `http://localhost:3000/user/update/${editingProperty._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Update state from server response
      const updatedProp = response.data.updatedProperty || response.data;
      setProperties(
        properties.map((prop) =>
          prop._id === updatedProp._id ? updatedProp : prop
        )
      );
      toast.success("Property updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error(
        "Failed to update property: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await axios.delete(`http://localhost:3000/property/delete/${id}`, {
        withCredentials: true,
      });
      const updatedProperties = properties.filter((prop) => prop._id !== id);
      setProperties(updatedProperties);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              My Properties
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              >
                <option value="">All Types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>
        </div>
        {editingProperty && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Edit Property
                        </h3>
                      </div>
                      <button
                        onClick={closeEditModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              {...register("title", {
                                required: "Title is required",
                              })}
                              className={`block w-full px-4 py-3 rounded-md shadow
                                -sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                  errors.title
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                            />
                            {errors.title && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.title.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Type
                            </label>
                            <select
                              {...register("type", {
                                required: "Property type is required",
                              })}
                              className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.type
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select type</option>
                              <option value="House">House</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Land">Land</option>
                              <option value="Office">Office</option>
                            </select>
                            {errors.type && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.type.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              {...register("status", {
                                required: "Status is required",
                              })}
                              className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.status
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select status</option>
                              <option value="Active">Active</option>
                              <option value="Sold">Sold</option>
                              <option value="Rented">Rented</option>
                            </select>
                            {errors.status && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.status.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div>
                              <input
                                type="number"
                                {...register("price", {
                                  required: "Price is required",
                                  min: {
                                    value: 0,
                                    message: "Price cannot be negative",
                                  },
                                })}
                                className={`pl-7 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                  errors.price
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                                min="0"
                              />
                            </div>
                            {errors.price && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.price.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              {...register("description", {
                                required: "Description is required",
                              })}
                              rows={3}
                              className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.description
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.description && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.description.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                          Property Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium ${
                                isLandType ? "text-gray-400" : "text-gray-700"
                              } mb-2`}
                            >
                              Bedrooms
                            </label>
                            <input
                              type="number"
                              {...register("bedrooms", {
                                required:
                                  !isLandType &&
                                  "Number of bedrooms is required",
                                min: {
                                  value: 0,
                                  message:
                                    "Number of bedrooms cannot be negative",
                                },
                              })}
                              disabled={isLandType}
                              className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.bedrooms
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } ${
                                isLandType
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : ""
                              }`}
                              min="0"
                            />
                            {errors.bedrooms && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.bedrooms.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Size
                            </label>
                            <div className="flex space-x-4">
                              <div className="flex-grow">
                                <input
                                  type="number"
                                  {...register("size", {
                                    required: "Size is required",
                                    min: {
                                      value: 0,
                                      message: "Size cannot be negative",
                                    },
                                  })}
                                  className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.size
                                      ? "border-red-300"
                                      : "border-gray-300"
                                  }`}
                                  min="0"
                                />
                              </div>
                              <select
                                {...register("sizeUnit")}
                                className="w-1/3 px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                              >
                                <option value="sqft">sqft</option>
                                <option value="m2">m²</option>
                                {isLandType && (
                                  <option value="acres">acres</option>
                                )}
                              </select>
                            </div>
                            {errors.size && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.size.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`bg-gray-50 p-6 rounded-lg ${
                          isLandType ? "opacity-50" : ""
                        }`}
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center justify-between">
                          <span>Amenities</span>
                          {isLandType && (
                            <span className="text-sm text-gray-500 italic">
                              Not applicable for land
                            </span>
                          )}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
                          {[
                            "Swimming Pool",
                            "Gym",
                            "Parking",
                            "Security",
                            "Garden",
                            "Elevator",
                            "Balcony",
                            "Storage",
                          ].map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                {...register("amenities")}
                                value={amenity}
                                disabled={isLandType}
                                className={`h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                                  isLandType ? "cursor-not-allowed" : ""
                                }`}
                              />
                              <label
                                className={`${
                                  isLandType ? "text-gray-400" : "text-gray-700"
                                }`}
                              >
                                {amenity}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify ustify-end space-x-4">
                        <button
                          type="button"
                          onClick={closeEditModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 flex overflow-x-auto">
                  {property.images && Array.isArray(property.images) && property.images.length > 0 ? (
                    property.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:3000/${img.replace(/\\/g, "/")}`}
                        alt={property.title}
                        className="w-48 h-48 object-cover mr-2 rounded"
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[property.status] || 'bg-gray-100 text-gray-700'}`}
                      style={{ minWidth: "75px" }}
                    >
                      <BuildingOfficeIcon className="h-4 w-4 mr-1 inline-block" />
                      {property.status}
                    </span>
                    <span className="text-gray-500 text-xs">{property.createdAt?.slice(0, 10)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {property.title}
                    </h3>
                    <button
                      onClick={() => toggleCardExpansion(property._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedCards.has(property._id) ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-3" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                      <span className="text-lg font-medium">
                        {property.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                      <span>
                        {property.size} {property.sizeUnit}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="mt-4 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                  {expandedCards.has(property._id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Description
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {property.description}
                          </p>
                        </div>
                        {property.type !== "Land" && (
                          <>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">
                                Bedrooms
                              </h4>
                              <p className="mt-1 text-sm text-gray-600">
                                {property.bedrooms}
                              </p>
                            </div>
                            {property.amenities &&
                              property.amenities.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Amenities
                                  </h4>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {property.amenities.map((amenity, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                      >
                                        {amenity}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => openEditModal(property)}
                      className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <PencilSquareIcon className="h-5 w-5 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProperties.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No properties found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
