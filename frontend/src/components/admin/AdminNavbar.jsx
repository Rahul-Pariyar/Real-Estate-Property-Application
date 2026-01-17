import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminNavbar() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Optionally, poll for new notifications every 60s
    // const interval = setInterval(fetchNotifications, 60000);
    // return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notification", { withCredentials: true });
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/notification/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md relative">
      <div className="text-2xl font-bold text-blue-700">Admin Dashboard</div>
      <div className="relative">
        <button
          className="relative focus:outline-none"
          onClick={() => setShowDropdown((v) => !v)}
        >
          <span className="material-icons text-3xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
            <div className="p-3 border-b font-semibold">Notifications</div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <li className="p-4 text-gray-500 text-center">No notifications</li>
              )}
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`px-4 py-3 border-b flex flex-col ${n.isRead ? "bg-gray-100" : "bg-blue-50"}`}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  style={{ cursor: n.isRead ? "default" : "pointer" }}
                >
                  <span className="font-medium">{n.message}</span>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
