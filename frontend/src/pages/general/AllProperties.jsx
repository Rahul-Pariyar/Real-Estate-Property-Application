import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const perPage = 6;

  // --- AUTH ---
  const isLogged = useSelector((state) => state.auth && state.auth.isLogged);

  // --- FILTER OPTIONS ---
  const typeOptions = ["House", "Apartment", "Land", "Office"];
  const statusOptions = ["Active", "Pending", "Sold", "Rented"];

  // --- FILTER + SEARCH ---
  const applyFilters = (arr) => {
    return arr.filter((p) => {
      if (typeFilter && p.type !== typeFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (priceMin && Number(p.price) < Number(priceMin)) return false;
      if (priceMax && Number(p.price) > Number(priceMax)) return false;
      return true;
    });
  };

  // Fetch properties on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch only active properties for public
        const response = await fetch("http://localhost:3000/property/public/all");
        const arr = await response.json();
        // Sort by createdAt/ID descending for latest
        const sorted = arr.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        setProperties(sorted);
        setFiltered(sorted);
      } catch (e) {
        setProperties([]);
        setFiltered([]);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let arr = properties;
    // Search
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(s)) ||
          (p.location && p.location.toLowerCase().includes(s)) ||
          (p.type && p.type.toLowerCase().includes(s))
      );
    }
    // Filters
    arr = applyFilters(arr);
    setFiltered(arr);
    setPage(1); // Reset to first page on filter/search change
  }, [search, typeFilter, statusFilter, priceMin, priceMax, properties]);

  // Pagination
  const paginated = filtered.slice((page-1)*perPage, page*perPage);
  const totalPages = Math.ceil(filtered.length/perPage);

  // Helper to get image
  const getImage = (property) => {
    if (property.images && property.images.length > 0) {
      // If the image path is already absolute (starts with http), use as is
      if (property.images[0].startsWith("http")) {
        return property.images[0];
      }
      // Otherwise, assume backend serves /uploads/ statically
      return `http://localhost:3000/${property.images[0]}`;
    }
    return "https://via.placeholder.com/300";
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">All Properties</h1>
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by title, location, or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="px-3 py-2 border rounded">
            <option value="">All Types</option>
            {typeOptions.map(opt=>(<option key={opt}>{opt}</option>))}
          </select>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 border rounded">
            <option value="">All Statuses</option>
            {statusOptions.map(opt=>(<option key={opt}>{opt}</option>))}
          </select>
          <input type="number" placeholder="Min Price" value={priceMin} onChange={e=>setPriceMin(e.target.value)} className="px-3 py-2 border rounded w-28" min="0"/>
          <input type="number" placeholder="Max Price" value={priceMax} onChange={e=>setPriceMax(e.target.value)} className="px-3 py-2 border rounded w-28" min="0"/>
        </div>

        {/* Latest Properties */}
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Latest Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {paginated.length ? paginated.map((property, idx) => (
            <div key={property._id || idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={getImage(property)}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{property.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{property.type} · {property.status}</p>
              <p className="text-lg font-semibold mb-2">${property.price}</p>
              <p className="text-sm text-gray-600 mb-2">{property.location}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                {property.bedrooms !== undefined && <span>{property.bedrooms} Bedrooms</span>}
                {property.amenities && property.amenities.length > 0 && (
                  <span>Amenities: {property.amenities.join(", ")}</span>
                )}
              </div>
              <p className="text-xs text-gray-400">Added: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "N/A"}</p>
              {/* --- VIEW DETAILS BUTTON --- */}
              <button onClick={()=>navigate(`/property/${property._id}`)} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                View Details
              </button>
              {/* --- BUY BUTTON --- */}
              
            </div>
          )) : <p className="text-gray-500">No properties found</p>}
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-10">
            <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>
            {Array.from({length: totalPages}, (_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 rounded border ${page===i+1 ? 'bg-indigo-600 text-white' : ''}`}>{i+1}</button>
            ))}
            <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
          </div>
        )}
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 mt-8">No properties found</p>
        )}
      </div>
    </div>
  );
};

export default AllProperties;
