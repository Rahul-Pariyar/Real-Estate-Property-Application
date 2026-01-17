import React from "react";

const About = () => {
  return (
    <div className="about-section w-screen px-6 sm:px-12 md:px-24 py-16 bg-gray-50 mt-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-600 text-lg">
          Building a Better Future with Smart Investments
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Who We Are
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            SamBriddhi Real Esate is a trusted
            investment and development firm specializing in real estate,
            financial growth strategies, and modern infrastructure solutions. We
            empower businesses and individuals to achieve long-term financial
            success.
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Our Mission
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We are committed to providing valuable, sustainable, and high-return
            investment opportunities. Our focus is on transparency, innovation,
            and customer-first service to help clients grow their wealth.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto mt-12 bg-slate-800 text-white p-8 rounded-lg text-center">
        <h3 className="text-2xl font-semibold">Why Choose Us?</h3>
        <ul className="mt-4 space-y-3 text-lg">
          <li>
            ✅ <strong>Expertise:</strong> Years of experience in real estate
            and investment.
          </li>
          <li>
            ✅ <strong>Integrity:</strong> We prioritize ethical practices and
            client trust.
          </li>
          <li>
            ✅ <strong>Growth-Oriented:</strong> Helping you build wealth with
            smart investments.
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-10">
        <p className="text-gray-700 text-lg">
          📍 <strong>Contact Us Today</strong> to Explore Investment
          Opportunities!
        </p>
      </div>
    </div>
  );
};

export default About;
