import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const propertyTypes = ["House", "Apartment", "Land", "Office"];

const propertyStatus = ["Active", "Pending", "Sold", "Rented"];

const amenities = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Garden",
  "Elevator",
  "Air Conditioning",
  "Heating",
  "Internet",
  "Furnished",
  "Balcony",
  "Storage",
];

export default function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "House",
    status: "Active",
    price: "",
    location: "",
    size: "",
    sizeUnit: "sqft", // Default size unit
    bedrooms: "",
    amenities: [],
    images: [],
    imagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: newImages,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // API submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("type", formData.type);
      data.append("price", formData.price);
      data.append("location", formData.location);
      data.append("size", formData.size);
      data.append("sizeUnit", formData.sizeUnit);
      data.append("bedrooms", formData.bedrooms);
      data.append("status", formData.status);
      formData.amenities.forEach((a) => data.append("amenities", a));
      formData.images.forEach((img) => data.append("images", img));
      await axios.post("http://localhost:3000/property/create", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Property submitted for approval.");
      navigate("/admin/properties");
    } catch (err) {
      alert("Failed to add property.");
    }
  };

  const isLandProperty = formData.type === "Land";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to list a new property.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Property Images */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Property Photos
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-40 w-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <PhotoIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer inline-flex items-center px-6 py-3 text-base font-medium border border-gray-300 shadow-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Upload Photos
                </label>
                <p className="mt-3 text-base text-gray-500">
                  You can upload multiple photos. First photo will be used as
                  the main image.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Property Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-base">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 text-base rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Property Type
              </label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {propertyStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="size"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Size
              </label>
              <input
                type="number"
                name="size"
                id="size"
                value={formData.size}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            {/* Size Unit Selection */}
            <div>
              <label
                htmlFor="sizeUnit"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Size Unit
              </label>
              <select
                name="sizeUnit"
                id="sizeUnit"
                value={formData.sizeUnit}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="sqft">sqft</option>
                <option value="sqm">sqm</option>
                <option value="acres">acres</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="bedrooms"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                disabled={isLandProperty} // Disable if property type is "Land"
                className={`block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  isLandProperty ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="location"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-5 w-5 text-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={amenity}
                    className="ml-2 text-base text-gray-600"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          {/* <div className="text-right">
            <button
              type="submit"
              className="px-6 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
            >
              Add Property
            </button>
          </div> */}
          <div className="flex justify-end space-x-6 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/properties")}
              className="px-8 py-3 text-base font-medium border border-gray-300 shadow-sm rounded-md text-white hover:text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-base font-medium border border-transparent shadow-sm rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
