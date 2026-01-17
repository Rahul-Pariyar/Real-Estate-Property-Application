import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  HomeIcon,
  PhotoIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const propertyTypes = ["House", "Apartment", "Land", "Office"];
const propertyStatus = ["Active", "Pending", "Sold", "Rented"];
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

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  type: yup.string().required("Type is required"),
  status: yup.string().required("Status is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price must be positive")
    .required("Price is required"),
  location: yup.string().required("Location is required"),
  size: yup
    .number()
    .typeError("Size must be a number")
    .min(0, "Size must be positive")
    .required("Size is required"),
  sizeUnit: yup.string().required("Size unit is required"),
  bedrooms: yup
    .number()
    .typeError("Bedrooms must be a number")
    .min(0, "Bedrooms must be positive")
    .nullable(),
  amenities: yup.array(),
  images: yup
    .mixed()
    .test("required", "At least one image is required", (value) => value && value.length > 0),
});

export default function AddProperty() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
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
    },
  });

  const propertyType = watch("type");
  const isLandType = propertyType === "Land";

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setValue("images", files, { shouldValidate: true });
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleAmenityChange = (amenity) => {
    const amenitiesValue = watch("amenities");
    setValue(
      "amenities",
      amenitiesValue.includes(amenity)
        ? amenitiesValue.filter((a) => a !== amenity)
        : [...amenitiesValue, amenity],
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data) => {
    if (!window.confirm('Are you sure you want to add this property?')) return;
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "images") {
          for (let i = 0; i < data.images.length; i++) {
            formData.append("images", data.images[i]);
          }
        } else if (Array.isArray(data[key])) {
          data[key].forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, data[key]);
        }
      }
      const response = await axios.post(
        "http://localhost:3000/property/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Property added successfully!");
      reset();
      setImagePreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-6">
          <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Add New Property</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HomeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="title"
                      type="text"
                      {...register("title")}
                      className={`pl-10 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.title ? "border-red-300" : "border-gray-300"}`}
                      placeholder="Enter property title"
                      aria-invalid={!!errors.title}
                    />
                  </div>
                  {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="description"
                      {...register("description")}
                      className={`pl-10 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? "border-red-300" : "border-gray-300"}`}
                      placeholder="Describe the property"
                      rows={4}
                      aria-invalid={!!errors.description}
                    />
                  </div>
                  {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    id="type"
                    {...register("type")}
                    className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.type ? "border-red-300" : "border-gray-300"}`}
                    aria-invalid={!!errors.type}
                  >
                    <option value="">Select type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>}
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    id="status"
                    {...register("status")}
                    disabled
                    defaultValue="Pending"
                    className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.status ? "border-red-300" : "border-gray-300"}`}
                    aria-invalid={!!errors.status}
                  >
                    <option value="Pending">Pending</option>
                  </select>
                  {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="location"
                      type="text"
                      {...register("location")}
                      className={`pl-10 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.location ? "border-red-300" : "border-gray-300"}`}
                      placeholder="Enter location"
                      aria-invalid={!!errors.location}
                    />
                  </div>
                  {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>}
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      {...register("price")}
                      className={`pl-10 block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.price ? "border-red-300" : "border-gray-300"}`}
                      placeholder="Enter price"
                      aria-invalid={!!errors.price}
                    />
                  </div>
                  {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <input
                    id="size"
                    type="number"
                    min="0"
                    {...register("size")}
                    className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.size ? "border-red-300" : "border-gray-300"}`}
                    placeholder="Enter size"
                    aria-invalid={!!errors.size}
                  />
                  {errors.size && <p className="mt-2 text-sm text-red-600">{errors.size.message}</p>}
                </div>
                <div>
                  <label htmlFor="sizeUnit" className="block text-sm font-medium text-gray-700 mb-2">Size Unit</label>
                  <select
                    id="sizeUnit"
                    {...register("sizeUnit")}
                    className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.sizeUnit ? "border-red-300" : "border-gray-300"}`}
                    aria-invalid={!!errors.sizeUnit}
                  >
                    <option value="sqft">sqft</option>
                    <option value="sqm">sqm</option>
                    {isLandType && <option value="acres">acres</option>}
                  </select>
                  {errors.sizeUnit && <p className="mt-2 text-sm text-red-600">{errors.sizeUnit.message}</p>}
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    id="bedrooms"
                    type="number"
                    min="0"
                    {...register("bedrooms")}
                    className={`block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.bedrooms ? "border-red-300" : "border-gray-300"}`}
                    placeholder="Enter number of bedrooms"
                    aria-invalid={!!errors.bedrooms}
                    disabled={isLandType}
                  />
                  {errors.bedrooms && <p className="mt-2 text-sm text-red-600">{errors.bedrooms.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className={`bg-gray-50 p-6 rounded-lg ${isLandType ? "opacity-50" : ""}`}>
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center justify-between">
              <span>Amenities</span>
              {isLandType && (
                <span className="text-sm text-gray-500 italic">Not applicable for land</span>
              )}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={watch("amenities").includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    disabled={isLandType}
                    className={`h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${isLandType ? "cursor-not-allowed" : ""}`}
                  />
                  <label className={`text-sm ${isLandType ? "text-gray-400" : "text-gray-700"}`}>{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Property Images</h3>
            <div className="mt-2 flex flex-col items-center gap-4">
              <div className="flex gap-2 flex-wrap justify-center">
                {imagePreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                ))}
              </div>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 3MB</p>
              {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
