import React, { useEffect, useState } from "react";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { Mail, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleIcon from "../../components/common/GoogleIcon.jsx";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../features/auth/authActions.js";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLogged, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLogged) {
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "seller") {
        navigate("/user");
      } else if (role === "buyer") {
        navigate("/");
      } else {
        navigate("/unauthorized");
      }
    }
  }, [navigate, isLogged, role]);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(userLogin(data)).unwrap();
      if (response.role === "admin") {
        navigate("/admin");
      } else if (response.role === "seller") {
        navigate("/user");
      } else if (response.role === "buyer") {
        navigate("/");
      } else {
        navigate("/unauthorized");
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(error || "Login Failed");
    }
  };

  return (
    <div className="max-h-screen w-full px-3 sm:px-14 md:px-24 lg:px-36 pt-0 pb-8 mb-16 mt-24 ">
      <form
        className="sm:w-5/6 md:3/5 lg:w-3/6 shadow-md shadow-slate-600 rounded-md mx-auto px-3 sm:px-6 pt-4 pb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl mb-8">
          <span className="font-bold text-blue-600">Log</span>in
        </h2>

        {/* Email Input */}
        <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3
          ${errors.email ? "mb-1" : "mb-5"}`}
        >
          <Mail className="text-gray-500" />
          <Input
            type="email"
            placeholder="Enter email"
            className="outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 border-x-none border-t-0"
            {...register("email", {
              required: {
                value: true,
                message: "email is required",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-red-600 w-full inline-block pl-11 text-xs ">
            {" "}
            {errors.email.message}{" "}
          </p>
        )}

        {/* Password Input */}
        <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3 ${
            errors.password ? "mb-1" : "mb-7"
          }`}
        >
          <LockKeyhole className="text-gray-500" />
          <Input
            type="password"
            placeholder="Enter password"
            className="outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 border-x-none border-t-"
            {...register("password", {
              required: {
                value: true,
                message: "password is required",
              },
              minLength: {
                value: 8,
                message: "minimum 8 character is required",
              },
            })}
          />
        </div>
        {errors.password && (
          <p className="text-red-600 w-full inline-block pl-11 text-xs">
            {errors.password.message}
          </p>
        )}

        {/* Sign Up Button */}
        <Button
          type="submit"
          className="px-3 py-2 mt-3 w-full border-none outline-none bg-blue-600 text-white hover:bg-blue-500 rounded hover:scale-105 transition duration-200 ease-linear"
        >
          Log In
        </Button>

        {/* Login Link */}
        <div className="my-4 font-light text-lg text-center">
          Haven't you an account?
          <Link to="/signup" className="text-blue-600 underline ml-1">
            Sign up
          </Link>
        </div>

        {/* OR Separator */}
        {/* <div className="flex items-center justify-between my-3">
          <hr className="w-1/5 border-gray-300" />
          <p className="text-gray-500">or</p>
          <hr className="w-1/5 border-gray-300" />
        </div> */}

        {/* Google Signup Button */}
        {/* <Button className="w-full flex justify-center gap-3 px-4 py-2 mx-auto text-white border rounded-md shadow-md bg-sky-600 transition duration-200 ease-in hover:scale-105 hover:bg-sky-500">
          <GoogleIcon className="w-5 h-5" />
          Log in with Google
        </Button> */}
      </form>
    </div>
  );
};

export default Login;
