// import React, { useState, useEffect } from "react";
// import Input from "../../components/ui/Input.jsx";
// import Button from "../../components/ui/Button.jsx";
// import { UserIcon as ProfileUserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import { updateUser, getCurrentUser } from "../../api/admin";
// import * as yup from "yup";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useSelector } from "react-redux";


// export default function AdminProfile() {
//   const { id } = useSelector((state) => state.auth);
//   const [editMode, setEditMode] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch user profile on mount
//   useEffect(() => {
//     async function fetchProfile() {
//       setLoading(true);
//       try {
//         const user = await getCurrentAdmin();
//         setUserData({
//           id: user._id,
//           fullName: user.fullName || '',
//           email: user.email || '',
//           phone: user.phone || '',
//           role: user.role || '',
//         });
//       } catch (err) {
//         toast.error("Failed to load profile. Please log in again.");
//       }
//       setLoading(false);
//     }
//     fetchProfile();
//   }, []);

//   // Validation schema
//   const schema = yup.object().shape({
//     fullName: yup.string(),
//     // Email editing removed per user request. Email is now read-only and not validated for editing.
//     phone: yup.string().matches(/^[0-9]{7,15}$/, "Enter a valid phone number"),
//     currentPassword: yup.string(),
//     newPassword: yup.string()
//       .test(
//         'password-strength',
//         'Password must include letters, numbers, and special characters',
//         function (value) {
//           // Skip validation if empty
//           if (!value || value.trim() === '') return true;
//           return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/.test(value);
//         }
//       ),
//     confirmPassword: yup.string()
//       .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
//   });

//   const { register, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       fullName: userData?.fullName || '',
//       email: userData?.email || '',
//       phone: userData?.phone || '',
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     },
//   });

//   useEffect(() => {
//     if (userData) {
//       reset({
//         fullName: userData.fullName || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     }
//   }, [reset, userData]);

//   const handleCancel = () => {
//     reset({
//       fullName: userData.fullName,
//       email: userData.email,
//       phone: userData.phone,
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     });
//     setEditMode(false);
//   };

//   // Simulate password update API (replace with real API call)
//   const updatePassword = async ({ currentPassword, newPassword }) => {
//     // TODO: Replace with real API call
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (currentPassword && newPassword) resolve({ success: true });
//         else reject("Password update failed");
//       }, 500);
//     });
//   };

 
//   const handleSave = async (data) => {
//     try {
//       // Only use Redux for user ID
//       if (!id) {
//         toast.error('User ID is missing - please log in again');
//         throw new Error('User ID is missing - please log in again');
//       }

//       // Only send fields that are filled
//       const updateData = {};
//       if (data.fullName) updateData.fullName = data.fullName;
// // Email is not editable
// if (data.phone) updateData.phone = data.phone;

//       // Password change logic - handle all cases
//       const isChangingPassword = data.newPassword || data.currentPassword || data.confirmPassword;
      
//       if (isChangingPassword) {
//         // Check if all password fields are provided
//         if (!data.currentPassword) {
//           toast.error("Current password is required to change password");
//           return;
//         }
        
//         if (!data.newPassword) {
//           toast.error("New password is required");
//           return;
//         }
        
//         if (!data.confirmPassword) {
//           toast.error("Please confirm your new password");
//           return;
//         }
        
//         // Check if passwords match
//         if (data.newPassword !== data.confirmPassword) {
//           toast.error("Passwords do not match");
//           return;
//         }
//         updateData.currentPassword = data.currentPassword;
//         updateData.newPassword = data.newPassword;
//       }

//       const response = await updateAdmin(userData.id, updateData);
//       setUserData({
//         ...userData,
//         fullName: data.fullName,
//         email: data.email,
//         phone: data.phone,
//       });
//       reset({
//         fullName: data.fullName,
//         // Email is not editable
//         phone: data.phone,
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: '',
//       });
//       setEditMode(false);
//       toast.success('Profile updated successfully');
//     } catch (error) {
//       toast.error(error.message || 'Failed to update profile');
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-xl mt-8">
//       <div className="flex justify-center">
//         <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
//           <ProfileUserIcon className="h-16 w-16 text-gray-400" />
//         </div>
//       </div>
//       <div className="flex justify-between items-center mt-4 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
//         {editMode ? null : (
//           <Button
//             type="button"
//             onClick={() => setEditMode(true)}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//           >
//             Edit
//           </Button>
//         )}
//       </div>
//       {editMode ? (
//         <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//             <Input name="fullName" {...register("fullName")}
//               className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
//             {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <Input name="phone" {...register("phone")}
//               className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
//             {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
//           </div>
//           <div className="border-t pt-4 mt-4">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Change Password</label>
//             <Input type="password" name="currentPassword" placeholder="Current password" {...register("currentPassword")}
//               className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
//             {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
//             <Input type="password" name="newPassword" placeholder="New password" {...register("newPassword")}
//               className="mt-3 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
//             {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
//             <Input type="password" name="confirmPassword" placeholder="Confirm new password" {...register("confirmPassword")}
//               className="mt-3 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
//             {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
//           </div>
//           <div className="flex justify-end space-x-2 pt-4">
//             <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
//               Save
//             </Button>
//             <Button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
//               Cancel
//             </Button>
//           </div>
//         </form>
//       ) : (
//         <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//           <div>
//             <dt className="flex items-center text-sm font-medium text-gray-500">
//               <ProfileUserIcon className="h-5 w-5 mr-1" /> Name
//             </dt>
//             <dd className="mt-1 text-sm text-gray-900">{userData?.fullName || ''}</dd>
//           </div>
//           <div>
//             <dt className="flex items-center text-sm font-medium text-gray-500">
//               <EnvelopeIcon className="h-5 w-5 mr-1" /> Email
//             </dt>
//             <dd className="mt-1 text-sm text-gray-900">{userData?.email || ''}</dd>
//           </div>
//           <div>
//             <dt className="flex items-center text-sm font-medium text-gray-500">
//               <PhoneIcon className="h-5 w-5 mr-1" /> Phone
//             </dt>
//             <dd className="mt-1 text-sm text-gray-900">{userData?.phone || ''}</dd>
//           </div>
//           <div>
//             <dt className="flex items-center text-sm font-medium text-gray-500">
//               <IdentificationIcon className="h-5 w-5 mr-1" /> Role
//             </dt>
//             <dd className="mt-1 text-sm text-gray-900 capitalize">{userData?.role || ''}</dd>
//           </div>
//         </dl>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { UserIcon as ProfileUserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { updateAdmin, getCurrentAdmin } from "../../api/admin";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

export default function AdminProfile() {
  const { id } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const user = await getCurrentAdmin();
        setUserData({
          id: user._id,
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || '',
        });
      } catch (err) {
        toast.error("Failed to load profile. Please log in again.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Validation schema
  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    phone: yup.string().matches(/^[0-9]{10}$/, "Enter a valid phone number"),
    currentPassword: yup.string(),
    newPassword: yup.string().test(
      "password-strength",
      "Password must include letters, numbers, and special characters",
      function (value) {
        if (!value || value.trim() === "") return true;
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(value);
      }
    ),
    confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userData, reset]);

  const handleCancel = () => {
    reset({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setEditMode(false);
  };

  const handleSave = async (data) => {
    if (!id) {
      toast.error("User ID is missing - please log in again");
      return;
    }

    const updateData = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.phone) updateData.phone = data.phone;

    // Handle password change
    const isChangingPassword = data.newPassword || data.currentPassword || data.confirmPassword;
    if (isChangingPassword) {
      if (!data.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
      if (!data.newPassword) {
        toast.error("New password is required");
        return;
      }
      if (!data.confirmPassword) {
        toast.error("Please confirm your new password");
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      updateData.currentPassword = data.currentPassword;
      updateData.newPassword = data.newPassword;
    }

    try {
      const response = await updateAdmin(userData.id, updateData);
      setUserData({
        ...userData,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });
      reset({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setEditMode(false);
      toast.success(response?.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-xl mt-8">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
          <ProfileUserIcon className="h-16 w-16 text-gray-400" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
        {!editMode && (
          <Button
            type="button"
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Edit
          </Button>
        )}
      </div>
      {editMode ? (
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input name="fullName" {...register("fullName")}
              className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input name="phone" {...register("phone")}
              className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Change Password</label>
            <Input type="password" name="currentPassword" placeholder="Current password" {...register("currentPassword")}
              className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
            <Input type="password" name="newPassword" placeholder="New password" {...register("newPassword")}
              className="mt-3 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
            <Input type="password" name="confirmPassword" placeholder="Confirm new password" {...register("confirmPassword")}
              className="mt-3 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Save
            </Button>
            <Button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <ProfileUserIcon className="h-5 w-5 mr-1" /> Name
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{userData?.fullName || ''}</dd>
          </div>
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <EnvelopeIcon className="h-5 w-5 mr-1" /> Email
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{userData?.email || ''}</dd>
          </div>
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <PhoneIcon className="h-5 w-5 mr-1" /> Phone
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{userData?.phone || ''}</dd>
          </div>
          <div>
            <dt className="flex items-center text-sm font-medium text-gray-500">
              <IdentificationIcon className="h-5 w-5 mr-1" /> Role
            </dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">{userData?.role || ''}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}