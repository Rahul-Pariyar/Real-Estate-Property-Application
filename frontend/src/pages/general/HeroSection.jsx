import React from "react";
import Header from "../../components/Header";
import Home from "./Home";

const HeroSection = () => {
  return (
    <>
      <div
        className="w-full min-h-screen relative bg-center bg-cover flex justify-center items-center "
        style={{ backgroundImage: 'url("/header_img.png")' }}
      >
        <Header />
        <div className=" w-full container Explore-section text-center py-4 px-8 md:px-20 lg:px-32 md:mt-20 mt-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl inline-block max-w-2xl font-semibold text-white opacity-90">
            Explore Properties that fit your dreams
          </h2>
          <div className="space-x-4 sm:space-x-7 mt-20 flex justify-center items-center flex-nowrap">
            <a
              href="#property"
              className=" px-2 py-2 sm:px-5 sm:py-3 text-white bg-transparent border-white border-[1.5px] rounded-lg text-base sm:text-lg font-bold"
            >
              Properties
            </a>
            <a
              href="#contact"
              className=" px-2 py-2 sm:px-5 sm:py-3 text-white bg-blue-600 rounded-lg sm:text-lg text-base font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
