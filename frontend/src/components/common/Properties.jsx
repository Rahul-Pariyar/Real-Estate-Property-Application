import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLogged = useSelector((state) => state.auth && state.auth.isLogged);
  const navigate = useNavigate();

  // Helper to get the correct image URL
  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      if (img.startsWith('http')) return img;
      return `http://localhost:3000/${img}`;
    }
    return "/placeholder.jpg";
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/property/public/latest?limit=6");
        setProperties(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="w-full px-6 sm:px-14 md:px-24 lg:px-28 mt-12 mb-10 overflow-hidden" id="property">
      <h2 className="font-light text-2xl sm:text-3xl text-neutral-900 mb-6">
        Buy Your Dream
        <span className="font-extrabold text-3xl sm:text-4xl text-sky-600"> P</span>
        roperty
      </h2>
      {loading ? (
        <div className="text-center py-10">Loading properties...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <Swiper
          spaceBetween={20}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 3 },
          }}
        >
          {properties.map((property, index) => (
            <SwiperSlide key={property.id || property._id || index}>
              <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src={getImageUrl(property)} alt={property.title} className="w-full h-64 object-cover" />
                <div className="p-4 flex flex-col justify-between h-48">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{property.location}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-indigo-600 font-bold">{property.price}</span>
                    <button
                        onClick={() => navigate(`/property/${property._id || property.id}`)}
                        className="text-base text-sky-700 hover:underline bg-sky-100 px-2 py-1.5 rounded"
                      >
                        View Details
                      </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="w-full mt-3">
        <Link to="/allproperties" className="text-white bg-sky-600 rounded-sm p-1.5 sm:p-2 text-lg float-right">
          Show More
        </Link>
      </div>
    </div>
  );
};

export default Properties;
