import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCurrentUser, updateUser } from "../../api/admin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  phone: yup.string().matches(/^[0-9]{7,15}$/, "Enter a valid phone number").required("Phone is required"),
  currentPassword: yup.string().test(
    'passwords-filled',
    'Current password is required to change password',
    function (value) {
      const { newPassword, confirmPassword } = this.parent;
      if (
        (newPassword && newPassword.trim() !== '') ||
        (confirmPassword && confirmPassword.trim() !== '') ||
        (value && value.trim() !== '')
      ) {
        return value && value.trim() !== '';
      }
      return true;
    }
  ),
  newPassword: yup.string().test(
    'passwords-filled',
    'New password is required',
    function (value) {
      const { currentPassword, confirmPassword } = this.parent;
      if (
        (currentPassword && currentPassword.trim() !== '') ||
        (confirmPassword && confirmPassword.trim() !== '') ||
        (value && value.trim() !== '')
      ) {
        return value && value.trim() !== '';
      }
      return true;
    }
  ).test(
    'password-strength',
    'Password must include letters, numbers, and special characters',
    function (value) {
      if (!value || value.trim() === '') return true;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      return passwordRegex.test(value);
    }
  ),
  confirmPassword: yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      const { newPassword } = this.parent;
      if (!newPassword || newPassword.trim() === '') return true;
      return value === newPassword;
    }
  ),
});

export default function Profile2() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors }, setError, clearErrors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((user) => {
        setUserData(user);
        reset({
          fullName: user.fullName || '',
          phone: user.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      })
      .catch((err) => {
        toast.error('Failed to fetch user profile. Please login again.');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [reset, navigate]);

  const handleCancel = () => {
    if (userData) {
      reset({
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    clearErrors();
    setEditMode(false);
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
      };
      if (data.newPassword) {
        payload.currentPassword = data.currentPassword;
        payload.newPassword = data.newPassword;
      }
      await updateUser(userData._id, payload);
      toast.success('Profile updated successfully');
      setEditMode(false);
      // Refetch user data
      const updated = await getCurrentUser();
      setUserData(updated);
      reset({
        fullName: updated.fullName || '',
        phone: updated.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
      if (err?.response?.data?.field) {
        setError(err.response.data.field, { message: err.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
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
            <Input
              name="fullName"
              {...register("fullName")}
              className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input
              name="phone"
              {...register("phone")}
              className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Change Password</label>
            <Input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              {...register("currentPassword")}
              className="mt-1 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
            )}
            <Input
              type="password"
              name="newPassword"
              placeholder="New password"
              {...register("newPassword")}
              className="mt-3 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="mt-3 block w-full px-4 py-2 text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900">{userData?.fullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{userData?.email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
