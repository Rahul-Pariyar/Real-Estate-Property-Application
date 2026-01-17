// import React from "react";
// import { assets } from "../../assets/assets";

// const Footer = () => {
//   return (
//     <>
//       <div className="footer w-full px-6 sm:px-14 md:px-24 py-10 bg-slate-900">
//         <div className="first-section flex flex-col md:flex-row md:justify-between justify-start items-start mx-auto gap-8 md:gap-16">
//           <div className="one w-full md:w-5/12 ">
//             <img src={assets.logo_dark} alt="logo_dark" className="mb-5" />
//             <p className=" text-gray-400 text-sm">
//               Lorem ipsum dolor sit amet, consectetur adipisicing elit.Eaque
//               quia delectus accusamus inventore corporis necessitatibus eum.
//             </p>
//           </div>
//           <div className="two w-full md:w-3/12">
//             <div className="text-lg font-semibold text-gray-200 mt-1 mb-5">
//               Company
//             </div>
//             <ul className=" text-gray-400 flex flex-col gap-3 text-sm">
//               <li>
//                 <a href="/">Home</a>
//               </li>
//               <li>
//                 <a href="/about">About us</a>
//               </li>
//               <li>
//                 <a href="/contact">Contact us</a>
//               </li>
//             </ul>
//           </div>
//           <div className="third w-full md:w-4/12">
//             <div className="text-gray-200 text-lg font-semibold mt-1 mb-5 ">
//               Social Media
//             </div>
//             <div className="flex flex-column ">
//               <a href="#" className="text-gray-200 text-sm">
//                 Facebook
//               </a>
//               <a href="#" className="text-gray-200 text-sm">
//                 Twitter
//               </a>
//               <a href="" className="text-gray-200 text-sm">
//                 Instagram
//               </a>
//               <a href="#" className="text-gray-200 text-sm">
//                 Youtube
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="last-section mt-20 flex w-full mx-auto  ">
//           <div className="text-gray-400 mx-auto w-full text-[15px] font-normal text-center border-t-[1px] border-gray-500 pt-5">
//             Copyright 2025 SamBriddhi Real Estate All Right Reserved.
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Footer;

import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="footer w-full px-6 sm:px-14 md:px-24 py-10 bg-slate-900">
      <div className="first-section flex flex-col md:flex-row md:justify-between gap-12 md:gap-16 max-w-7xl mx-auto">
        {/* Logo and Description */}
        <div className="w-full md:w-5/12">
          <img src={assets.logo_dark} alt="logo_dark" className="mb-5" />
          <p className="text-gray-400 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque quia
            delectus accusamus inventore corporis necessitatibus eum.
          </p>
        </div>

        {/* Company Links */}
        <div className="w-full md:w-3/12">
          <h3 className="text-lg font-semibold text-gray-200 mb-5">Company</h3>
          <ul className="text-gray-400 flex flex-col gap-3 text-sm">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/contact">Contact us</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="w-full md:w-4/12">
          <h3 className="text-lg font-semibold text-gray-100 mb-5">
            Social Media
          </h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="last-section mt-16">
        <div className="text-gray-400 w-full text-[15px] text-center border-t border-gray-600 pt-5">
          © 2025 SamBriddhi Real Estate. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
