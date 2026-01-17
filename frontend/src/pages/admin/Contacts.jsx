import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/contact/all", { withCredentials: true });
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Contact Submissions</h1>
      {contacts.length === 0 ? (
        <div className="text-gray-500">No contact submissions</div>
      ) : (
        <ul className="space-y-4">
          {contacts.map((c) => (
            <li key={c._id} className="p-4 border rounded shadow-md">
              <p><strong>Name:</strong> {c.name}</p>
              <p><strong>Email:</strong> {c.email}</p>
              <p><strong>Message:</strong> {c.message}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
