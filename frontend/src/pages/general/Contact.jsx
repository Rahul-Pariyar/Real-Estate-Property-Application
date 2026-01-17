import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation for required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    // Email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/contact/create", formData);
      toast.success("Message sent!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact"
      className="w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-32 py-10 flex flex-col lg:flex-row justify-center items-center lg:items-start lg:space-x-2 mt-16"
    >
      {/* Contact Information Section */}
      <div className="w-full pl-8 sm:px-2 lg:w-2/5 flex flex-col items-center lg:items-start mb-8 lg:mb-0">
        <h1 className="text-3xl md:text-4xl text-center lg:text-left font-extralight cursor-pointer tracking-tight mb-10">
          <span className="text-sky-700 font-semibold">Contact</span>
          <span className="font-extralight text-3xl"> With Us</span>
        </h1>

        <div className="w-full space-y-6">
          <div className="flex items-center">
            <i className="fa-solid fa-envelope text-2xl text-sky-700 mr-4"></i>
            <div>
              <p className="text-lg font-semibold">Email</p>
              <p className="text-gray-600">SamBriddhiRealEstate90@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-phone text-2xl text-sky-700 mr-4"></i>
            <div>
              <p className="text-lg font-semibold">Phone</p>
              <p className="text-gray-600">061-467903</p>
            </div>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-location-dot text-2xl text-sky-700 mr-4"></i>
            <div>
              <p className="text-lg font-semibold">Location</p>
              <p className="text-gray-600">
                Rashtra Bank Road,Pokhara, Nepal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full lg:w-3/5 mt-14 sm:mt-1">
        <div className="mb-2 w-full ">
          <h1 className="text-3xl sm:text-4xl mx-auto text-center font-extralight  tracking-tight">
            <span className="text-blue-500 font-semibold ">Contact </span>
            <span className="font-extralight text-4xl">Form</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div
            key="name"
            className="input-cnt rounded-md w-full mt-3 flex justify-start bg-white hover:shadow-lg hover:shadow-slate-100 border-gray-800 border-[0.5px]"
          >
            <i className="fa-regular fa-user text-xl px-4 py-3 rounded-tl-md rounded-bl-md border-r-gray-800 border-r-[0.5px]"></i>
            <input
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="px-4 py-3 bg-transparent outline-none border-none"
              name="name"
            />
          </div>
          <div
            key="email"
            className="input-cnt rounded-md w-full mt-3 flex justify-start hover:shadow-lg hover:shadow-slate-100 bg-white border-gray-800 border-[0.5px]"
          >
            <i className="fa-regular fa-envelope text-xl px-4 py-3 rounded-tl-md rounded-bl-md border-gray-800 border-r-[0.5px]"></i>
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 bg-transparent outline-none border-none"
              name="email"
            />
          </div>
          <div
            key="textarea"
            className="input-cnt rounded-md w-full mt-3 h-64 flex hover:shadow-md hover:shadow-slate-100 bg-white border-gray-800 border-[0.5px]"
          >
            <i className="fa-regular fa-message text-xl px-4 py-3 rounded-tl-md rounded-bl-md border-gray-800 border-r-[0.5px] h-full leading-[14rem]"></i>
            <textarea
              value={formData.message}
              onChange={handleChange}
              className="w-full h-full py-3 px-4 outline-none border-none bg-transparent"
              placeholder="Enter message..."
              name="message"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
            className="w-full px-4 py-3 text-lg rounded-md mt-3 submit-button hover:shadow-lg hover:shadow-slate-100 cursor-pointer bg-blue-600 text-white"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
