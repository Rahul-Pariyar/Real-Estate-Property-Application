import React from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../redux/authActions";

const Logout = ({ className = "", children, ...props }) => {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(userLogout());
  };

  return (
    <button
      onClick={handleLogOut}
      className={`${className} px-3 py-2 text-xl outline-none border-none `}
      {...props}
    >
      {children || "Logout"}
    </button>
  );
};

export default Logout;
