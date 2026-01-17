import React from "react";
import HeroSection from "../../components/common/HeroSection";
import Properties from "../../components/common/Properties";
import About from "../../pages/general/About";
import Contact from "../../pages/general/Contact";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const Home = () => {
  return (
    <>
      <div className="home w-screen min-h-screen">
        <HeroSection />
        <Properties />
        <About />
        <Contact />
      </div>
    </>
  );
};

export default Home;

{
  /* <form
        action=""
        className="flex flex-row-reverse items-center rounded-full bg-white opacity-60 mt-16 flex-nowrap"
      >
        <input
          type="text"
          placeholder="Search..."
          className="outline-none border-none w-full py-2 rounded-r-full "
        />
        <i className="fa-solid fa-magnifying-glass text-2xl px-2 cursor-pointer "></i>
      </form> */
}
