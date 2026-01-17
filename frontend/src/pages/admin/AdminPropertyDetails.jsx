import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminPropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/property/${id}`);
        setProperty(res.data);
      } catch (err) {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!property) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Admin Property Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={property.images && property.images.length > 0 ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:3000/${property.images[0]}`) : 'https://via.placeholder.com/400'}
            alt={property.title}
            className="w-full h-72 object-cover rounded mb-4"
          />
          <div className="text-lg font-semibold text-gray-800">{property.title}</div>
          <div className="text-gray-600 mt-2">{property.location}</div>
          <div className="text-indigo-700 font-bold text-xl mt-2">${property.price}</div>
          <div className="mt-2">Type: <span className="font-medium">{property.type}</span></div>
          <div className="mt-2">Status: <span className="font-medium">{property.status}</span></div>
          <div className="mt-2">Size: {property.size} {property.sizeUnit}</div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-700 mb-4">{property.description}</p>
          <h2 className="text-xl font-bold mb-2">Owner Info</h2>
          <div className="mb-2">Name: <span className="font-medium">{property.ownerContact?.fullName || 'N/A'}</span></div>
          <div className="mb-2">Email: <span className="font-medium">{property.ownerContact?.email || 'N/A'}</span></div>
          <div className="mb-2">Phone: <span className="font-medium">{property.ownerContact?.phone || 'N/A'}</span></div>
          {/* Admin controls example */}
          <div className="mt-6 flex gap-4">
            <button
              className={`px-4 py-2 text-white rounded ${property.status === 'Active' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={async () => {
                const nextStatus = property.status === 'Active' ? 'Pending' : 'Active';
                if (!window.confirm(`Are you sure you want to set this property as ${nextStatus}?`)) return;
                try {
                  await axios.patch(`http://localhost:3000/property/status/${property._id}`, { status: nextStatus }, { withCredentials: true });
                  alert(`Property status set to ${nextStatus}.`);
                  setProperty(prev => ({ ...prev, status: nextStatus }));
                } catch (err) {
                  alert("Failed to update property status.");
                }
              }}
            >
              {property.status === 'Active' ? 'Set Pending' : 'Approve'}
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
                try {
                  await axios.delete(`http://localhost:3000/property/${property._id}`);
                  alert("Property deleted successfully.");
                  window.location.href = "/admin/properties";
                } catch (err) {
                  alert("Failed to delete property.");
                }
              }}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/admin/notifications"}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
