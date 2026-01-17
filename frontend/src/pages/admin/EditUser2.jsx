// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { updateUserByAdmin, fetchAllUsers } from "../../api/admin";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const roles = ["admin", "seller"];

// const schema = yup.object().shape({
//   fullName: yup.string().required("Full name is required"),
//   email: yup.string().email("Invalid email format").required("Email is required"),
//   phone: yup.string()
//     .matches(/^$|^[0-9]{10}$/, "Phone number must be 10 digits")
//     .nullable(),
//   role: yup.string().oneOf(["admin", "seller"], "Role must be admin or seller").required("Role is required"),
//   newPassword: yup.string()
//     .nullable()
//     .notRequired()
//     .test(
//       "password-strength",
//       "Password must be at least 6 characters and include a letter, number, and special character.",
//       (value) => {
//         if (!value) return true; // allow empty
//         return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/.test(value);
//       }
//     ),
//   confirmPassword: yup.string()
//     .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
// });

// export default function EditUser2() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");

//   const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
//     resolver: yupResolver(schema),
//     mode: 'onTouched',
//     defaultValues: {
//       fullName: '',
//       email: '',
//       phone: '',
//       role: 'seller',
//       newPassword: '',
//       confirmPassword: '',
//     },
//   });

//   useEffect(() => {
//     async function loadUser() {
//       setLoading(true);
//       try {
//         const all = await fetchAllUsers();
//         const user = all.find((u) => u._id === id);
//         if (!user) throw new Error("User not found");
//         reset({
//           fullName: user.fullName,
//           email: user.email,
//           phone: user.phone || "",
//           role: user.role,
//           newPassword: '',
//           confirmPassword: '',
//         });
//       } catch (e) {
//         setLoadError("Failed to load user.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadUser();
//   }, [id, reset]);

//   const onSubmit = async (data) => {
//     const payload = {
//       fullName: data.fullName,
//       email: data.email,
//       phone: data.phone,
//       role: data.role,
//     };
//     if (data.newPassword) payload.newPassword = data.newPassword;
//     try {
//       await updateUserByAdmin(id, payload);
//       alert("User updated successfully");
//       navigate("/admin/users");
//     } catch (e) {
//       alert("Failed to update user");
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (loadError) return <div className="p-6 text-red-500">{loadError}</div>;

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white rounded-md shadow">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit User</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label htmlFor="fullName" className="block text-base font-medium text-gray-700 mb-2">Full Name</label>
//           <input type="text" id="fullName" {...register("fullName")}
//             className="block w-full px-4 py-3 border rounded-md text-base focus:border-primary-500 focus:ring-primary-500" />
//           {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
//         </div>
//         <div>
//           <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">Email</label>
//           <input type="email" id="email" {...register("email")}
//             className="block w-full px-4 py-3 border rounded-md text-base focus:border-primary-500 focus:ring-primary-500" />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//         </div>
//         <div>
//           <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">Phone</label>
//           <input type="text" id="phone" {...register("phone")}
//             className="block w-full px-4 py-3 border rounded-md text-base focus:border-primary-500 focus:ring-primary-500" />
//           {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//         </div>
//         <div>
//           <label htmlFor="role" className="block text-base font-medium text-gray-700 mb-2">Role</label>
//           <select id="role" {...register("role")}
//             className="block w-full px-4 py-3 border rounded-md text-base focus:border-primary-500 focus:ring-primary-500">
//             {roles.map((r) => (
//               <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
//             ))}
//           </select>
//           {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
//         </div>
//         <div>
//           <label className="block text-base font-medium text-gray-700 mb-2">Change Password (optional)</label>
//           <input type="password" placeholder="New password" {...register("newPassword")}
//             className="block w-full px-4 py-3 border rounded-md text-base focus:border-primary-500 focus:ring-primary-500" />
//           <input type="password" placeholder="Confirm new password" {...register("confirmPassword")}
//             className="mt-2 block w-full px-4 py-3 border rounded-md text-base focus:border-primary-500 focus:ring-primary-500" />
//           {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
//           {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
//         </div>
//         <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
//           <button type="button" onClick={() => navigate("/admin/users")}
//             className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
//           <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Save Changes</button>
//         </div>
//       </form>
//     </div>
//   );
// }
