import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
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
    <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 w-64 transition-transform duration-300 ${sidebarOpen ? '' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <span className="font-bold text-xl text-blue-700">Admin Panel</span>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-600 text-2xl">&times;</button>
      </div>
      <nav className="flex flex-col py-4">
        {/* Example nav items */}
        <a href="/admin/dashboard" className="px-6 py-3 hover:bg-gray-100">Dashboard</a>
        <a href="/admin/properties" className="px-6 py-3 hover:bg-gray-100">Properties</a>
        <a href="/admin/users" className="px-6 py-3 hover:bg-gray-100">Users</a>
        {/* Notification Bell */}
        <div className="relative px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => setShowDropdown((v) => !v)}>
          <span className="material-icons align-middle text-2xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute left-8 top-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
          <span className="ml-3">Notifications</span>
          {showDropdown && (
            <div className="absolute left-48 top-0 w-80 bg-white shadow-lg rounded-lg z-50">
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
    </aside>
  );
}
