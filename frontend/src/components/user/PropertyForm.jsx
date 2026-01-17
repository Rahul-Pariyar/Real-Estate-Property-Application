// import React, { useState } from "react";
// import axios from "axios";

// const propertyTypes = ["Residential", "Land", "Apartment", "Office"];
// const amenitiesList = [
//   "Swimming Pool",
//   "Gym",
//   "Parking",
//   "Security",
//   "Garden",
//   "Elevator",
//   "Air Conditioning",
//   "Heating",
//   "Internet",
//   "Furnished",
// ];

// export default function PropertyForm({ isOpen, onClose, onSubmit }) {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: "Residential",
//     price: "",
//     location: "",
//     size: "",
//     sizeUnit: "sqft",
//     bedrooms: "",
//     amenities: [],
//     images: [],
//     imagePreview: null,
//     loading: false,
//   });

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAmenityChange = (amenity) => {
//     setFormData((prev) => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter((a) => a !== amenity)
//         : [...prev.amenities, amenity],
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         images: files,
//         imagePreview: URL.createObjectURL(files[0]),
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormData((prev) => ({ ...prev, loading: true }));
//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("type", formData.type);
//       data.append("price", formData.price);
//       data.append("location", formData.location);
//       data.append("size", formData.size);
//       data.append("sizeUnit", formData.sizeUnit);
//       data.append("bedrooms", formData.bedrooms);
//       formData.amenities.forEach((a) => data.append("amenities", a));
//       formData.images.forEach((img) => data.append("images", img));
//       await axios.post("http://localhost:3000/property/create", data, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (onSubmit) onSubmit();
//       alert("Property submitted for approval.");
//       onClose();
//     } catch (err) {
//       alert("Failed to add property.");
//     } finally {
//       setFormData((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   const isLandProperty = formData.type === "Land";

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative"
//       >
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
//         >
//           &times;
//         </button>
//         <h2 className="text-2xl font-bold mb-6">Add Property</h2>
//         {/* Images */}
//         <div className="mb-4">
//           <label className="block text-base font-medium text-gray-700 mb-2">
//             Property Images
//           </label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="mb-2"
//           />
//           {formData.imagePreview && (
//             <img
//               src={formData.imagePreview}
//               alt="Preview"
//               className="h-32 w-32 object-cover rounded mt-2"
//             />
//           )}
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Title
//             </label>
//             <input
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Price
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Type
//             </label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             >
//               {propertyTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Bedrooms
//             </label>
//             <input
//               type="number"
//               name="bedrooms"
//               value={formData.bedrooms}
//               onChange={handleChange}
//               disabled={isLandProperty}
//               className={`w-full px-3 py-2 border rounded ${isLandProperty ? "bg-gray-100 cursor-not-allowed" : ""}`}
//             />
//           </div>
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Size
//             </label>
//             <input
//               type="number"
//               name="size"
//               value={formData.size}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Size Unit
//             </label>
//             <select
//               name="sizeUnit"
//               value={formData.sizeUnit}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             >
//               <option value="sqft">sqft</option>
//               <option value="sqm">sqm</option>
//             </select>
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Location
//             </label>
//             <input
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//               required
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-base font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//               rows={3}
//               required
//             />
//           </div>
//         </div>
//         <div className="my-4">
//           <label className="block text-base font-medium text-gray-700 mb-2">
//             Amenities
//           </label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             {amenitiesList.map((amenity) => (
//               <label key={amenity} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={formData.amenities.includes(amenity)}
//                   onChange={() => handleAmenityChange(amenity)}
//                   disabled={isLandProperty}
//                   className="mr-2"
//                 />
//                 <span className={isLandProperty ? "text-gray-400" : "text-gray-700"}>{amenity}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className="px-8 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//             disabled={formData.loading}
//           >
//             {formData.loading ? "Submitting..." : "Submit Property"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
