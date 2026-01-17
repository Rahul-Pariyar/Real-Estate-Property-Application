import React, { useState } from "react";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { Mail, LockKeyhole, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "../../components/common/GoogleIcon.jsx";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegister } from "../../features/auth/authActions.js";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required").min(2, "Full name must be at least 2 characters").max(50, "Full name must be at most 50 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Enter a valid phone number").required("Phone is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/, 
      "Password must include letters, numbers, and special characters"
    ),
  userType: yup.string().oneOf(["seller", "buyer"], "Select a user type").required("User type is required"),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: "seller" },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(userRegister(data)).unwrap();
      toast.success(response.message || "Signup successful! Please log in.");
      navigate("/login", { state: { signupSuccess: true } });
    } catch (error) {
      toast.error(error || "Signup failed");
    }
  };

  return (
    <div className="max-h-screen w-full px-3 sm:px-14 md:px-24 lg:px-36 pt-0 pb-8 mb-16 mt-24 ">
      <form
        className="sm:w-5/6 md:3/5 lg:w-3/6 shadow-md shadow-slate-600 rounded-md mx-auto px-3 sm:px-6 pt-4 pb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl mb-6">
          <span className="font-bold text-blue-600">Sign</span>up
        </h2>

        {/* Full Name Input */}
        <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3 ${
            errors.fullName ? "mb-0" : "mb-5"
          }`}
        >
          <User className="text-gray-500" />
          <Input
            type="text"
            placeholder="Enter full name"
            className="border-x-none border-t-0 outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 "
            {...register("fullName")}
          />
        </div>

        {errors.fullName && (
          <p className="w-full pl-11 text-xs text-red-500 inline-block">
            {errors.fullName.message}
          </p>
        )}

        {/* Email Input */}
        <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3 ${
            errors.email ? "mb-0" : "mb-5"
          } `}
        >
          <Mail className="text-gray-500" />
          <Input
            type="email"
            placeholder="Enter email"
            className="outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 border-x-none border-t-0"
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p className="w-full pl-11 text-xs text-red-500 inline-block">
            {errors.email.message}
          </p>
        )}

        {/* Phone Input */}
        <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3 ${
            errors.phone ? "mb-0" : "mb-5"
          } `}
        >
          <Phone className="text-gray-500" />
          <Input
            type="text"
            placeholder="Enter phone number"
            className="outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 border-x-none border-t-0"
            {...register("phone")}
          />
        </div>

        {errors.phone && (
          <p className="w-full pl-11 text-xs text-red-500 inline-block">
            {errors.phone.message}
          </p>
        )}

        {/* Password Input */}
        <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3 ${
            errors.password ? "mb-0" : "mb-5"
          } `}
        >
          <LockKeyhole className="text-gray-500" />
          <Input
            type="password"
            placeholder="Enter password"
            className={`outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 border-x-none`}
            {...register("password")}
          />
        </div>
        
        {errors.password && (
          <p className="w-full pl-11 text-xs text-red-500 inline-block">
            {errors.password.message}
          </p>
        )}

        {/* User Type Input */}
        {/* <div
          className={`inpt-cnt flex items-center bg-white rounded-md px-3 ${
            errors.userType ? "mb-0" : "mb-5"
          } `}
        >
          <select
            {...register("userType")}
            className="outline-none text-base ml-3 pl-0 pr-3 py-2 w-full border-b-[1px]
            border-b-slate-800 border-x-none border-t-0"
          >
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
        {errors.userType && (
          <p className="w-full pl-11 text-xs text-red-500 inline-block">
            {errors.userType.message}
          </p>
        )} */}

        {/* Sign Up Button */}
        <Button
          type="submit"
          className="px-3 py-2 w-full border-none outline-none bg-blue-600 text-white hover:bg-blue-500 rounded hover:scale-105 transition duration-200 ease-linear mt-5"
        >
          Sign Up
        </Button>

        {/* Login Link */}
        <div className="my-4 flex justify-center gap-2 items-center flex-wrap  font-light text-lg ">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Log In
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
          Sign up with Google
        </Button> */}
      </form>
    </div>
  );
};

export default Signup;
