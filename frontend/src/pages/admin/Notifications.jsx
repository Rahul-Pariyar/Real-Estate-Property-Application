import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notification", { withCredentials: true });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/notification/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-gray-500">No notifications</div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 border rounded-md ${
                n.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{n.message}</span>
                {n.property && (
                  <button
                    onClick={() => navigate(`/admin/property/${n.property}`)}
                    className="ml-4 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs"
                  >
                    View Property
                  </button>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
