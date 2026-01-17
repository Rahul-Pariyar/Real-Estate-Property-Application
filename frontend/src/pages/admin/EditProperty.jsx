import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const propertyTypes = ["House", "Apartment", "Land", "Office"];
const amenitiesList = [
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

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "House",
    status: "Pending",
    price: "",
    location: "",
    size: "",
    sizeUnit: "sqft",
    bedrooms: "",
    amenities: [],
    images: [],
    imagePreview: null,
    existingImages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await axios.get(`http://localhost:3000/property/${id}`, { withCredentials: true });
        const p = res.data;
        setFormData({
          title: p.title || "",
          description: p.description || "",
          type: p.type || "House",
          status: p.status || "Pending",
          price: p.price || "",
          location: p.location || "",
          size: p.size || "",
          sizeUnit: p.sizeUnit || "sqft",
          bedrooms: p.bedrooms || "",
          amenities: p.amenities || [],
          images: [],
          imagePreview: p.images?.[0] ? `http://localhost:3000/${p.images[0]}` : null,
          existingImages: p.images || [],
        });
      } catch (e) {
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const newImages = files;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("type", formData.type);
      data.append("status", formData.status);
      data.append("price", formData.price);
      data.append("location", formData.location);
      data.append("size", formData.size);
      data.append("sizeUnit", formData.sizeUnit);
      data.append("bedrooms", formData.bedrooms);
      formData.amenities.forEach((a) => data.append("amenities", a));
      formData.images.forEach((img) => data.append("images", img));
      await axios.put(`http://localhost:3000/property/edit/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Property updated successfully.");
      navigate("/admin/properties");
    } catch (e) {
      alert("Failed to update property.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="h-5 w-5 text-blue-600"
                />
                <label className="ml-2 text-gray-700">{amenity}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          <div className="mt-4">
            {formData.imagePreview ? (
              <img src={formData.imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded" />
            ) : (
              <PhotoIcon className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate("/admin/properties")} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
