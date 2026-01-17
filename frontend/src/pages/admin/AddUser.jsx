import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/admin";

const roles = ["admin", "seller"];

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]{7,15}$/, "Enter a valid phone number").required("Phone is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/,"Password must include letters, numbers, and special characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  userType: yup.string().oneOf(roles, "Select a user type").required("User type is required"),
});
const defaultValues = { userType: "seller" };

export default function AddUser() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await createUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        userType: data.userType,
      });
      alert("User created successfully");
      navigate("/admin/users");
    } catch (error) {
      alert("Failed to create user");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
          <p className="mt-2 text-lg text-gray-600">
            Create a new user account and set their role and permissions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                {...register("fullName")}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                {...register("email")}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                {...register("phone")}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                {...register("password")}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="userType"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Role
              </label>
              <select
                name="userType"
                id="userType"
                {...register("userType")}
                className="block w-full px-4 py-3 text-base rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.userType && (
                <p className="mt-2 text-sm text-red-600">{errors.userType.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-8 py-3 text-base font-medium border border-gray-300 shadow-sm rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-base font-medium border border-transparent shadow-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
