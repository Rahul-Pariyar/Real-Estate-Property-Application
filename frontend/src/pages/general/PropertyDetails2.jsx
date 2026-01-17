import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetails } from "../../api/propertyDetails";

const PropertyDetails2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPropertyDetails(id);
        setProperty(data);
        setMainImage(getImage(data));
      } catch (e) {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (property) setMainImage(getImage(property));
  }, [property]);

  const getImage = (property) => {
    if (property?.images && property.images.length > 0) {
      if (property.images[0].startsWith("http")) return property.images[0];
      return `http://localhost:3000/${property.images[0]}`;
    }
    return "https://via.placeholder.com/300";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg">Loading property details...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <span className="text-red-500 mb-4">{error}</span>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded">Go Back</button>
      </div>
    );
  }
  if (!property) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 pb-10">
      {/* Large Hero Image */}
      <div className="relative w-full h-[380px] md:h-[480px] lg:h-[540px] bg-gray-200 flex items-center justify-center overflow-hidden">
        <img src={mainImage} alt={property.title} className="absolute inset-0 w-full h-full object-cover object-center" style={{ zIndex: 1 }} />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {property.images?.length > 1 && property.images.map((img, idx) => {
            const src = img.startsWith("http") ? img : `http://localhost:3000/${img}`;
            return (
              <img
                key={idx}
                src={src}
                alt={`Thumbnail ${idx}`}
                onClick={() => setMainImage(src)}
                className={`h-14 w-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${mainImage === src ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-blue-400 hover:scale-105'}`}
                style={{ boxShadow: mainImage === src ? '0 0 0 2px #2563eb' : undefined }}
              />
            );
          })}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent z-2"></div>
      </div>

      {/* Floating Card */}
      <div className="relative z-10 max-w-4xl mx-auto -mt-32 md:-mt-40">
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 md:px-12 md:py-12 flex flex-col gap-8">
          {/* Title & Price */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-2 md:mb-0">{property.title}</h2>
            <div className="text-3xl text-green-700 font-bold flex items-center gap-2">💰 ${property.price}</div>
          </div>
          {/* Location & Status */}
          <div className="flex flex-wrap gap-4 items-center text-lg">
            <div className="flex items-center gap-1"><span role="img" aria-label="location">📍</span>{property.location}</div>
            <div className="flex items-center gap-1"><span role="img" aria-label="status">📈</span><span className={`px-2 py-1 rounded text-white ${property.status === "Active" ? "bg-green-600" : "bg-gray-500"}`}>{property.status}</span></div>
            <div className="flex items-center gap-1"><span role="img" aria-label="date">🗓️</span>Listed {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "N/A"}</div>
          </div>
          {/* Description */}
          <div className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">{property.description}</div>
          {/* Features */}
          <div className="flex flex-wrap gap-6 justify-start text-base text-gray-700">
            <div className="flex items-center gap-2"><span role="img" aria-label="type">🏷️</span> <span className="font-semibold">Type:</span> {property.type}</div>
            <div className="flex items-center gap-2"><span role="img" aria-label="size">📏</span> <span className="font-semibold">Size:</span> {property.size} {property.sizeUnit}</div>
            <div className="flex items-center gap-2"><span role="img" aria-label="bedrooms">🛏️</span> <span className="font-semibold">Bedrooms:</span> {property.bedrooms ?? 'N/A'}</div>
          </div>
          {/* Amenities */}
          <div className="mt-2">
            <span className="font-semibold text-blue-900">Amenities:</span>{' '}
            {property.amenities?.length ? (
              <span className="flex flex-wrap gap-2 mt-2">
                {property.amenities.map((a, i) => (
                  <span key={i} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{a}</span>
                ))}
              </span>
            ) : <span className="text-gray-600">None</span>}
          </div>
          {/* Contact & CTA */}
          {property.ownerContact && (
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow px-6 py-6">
              <div>
                <div className="text-lg font-semibold mb-2 flex items-center gap-2"><span role="img" aria-label="contact">📞</span>Contact Information</div>
                <div className="text-gray-800 flex items-center gap-2 mb-1"><span className="font-medium">👤 Name:</span> {property.ownerContact.fullName}</div>
                <div className="text-gray-800 flex items-center gap-2 mb-1">
                  <span className="font-medium">✉️ Email:</span>
                  {property.ownerContact.email ? (
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(property.ownerContact.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 font-medium"
                    >
                      {property.ownerContact.email}
                    </a>
                  ) : 'N/A'}
                </div>
                <div className="text-gray-800 flex items-center gap-2">
                  <span className="font-medium">📱 Phone:</span>
                  {property.ownerContact.phone ? (
                    <a href={`tel:${property.ownerContact.phone}`} className="text-blue-600 underline hover:text-blue-800 font-medium">
                      {property.ownerContact.phone}
                    </a>
                  ) : 'N/A'}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => navigate('/login') }
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl shadow-xl hover:from-blue-700 hover:to-blue-600 text-xl font-bold tracking-wide transition-all duration-200"
                >
                  🚀 Buy Now
                </button>
                <div className="text-xs text-gray-500">You must be logged in to contact the owner.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails2;
