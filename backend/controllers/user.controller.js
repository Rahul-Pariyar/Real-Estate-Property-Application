import Property from "../models/property.model.js";
import User from "../models/user.model.js";
import Joi from "joi";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id fullName email phone role avatar");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Delete user's properties
    await Property.deleteMany({ owner: id });
    res.status(200).json({ message: "User and their properties deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, currentPassword, newPassword } = req.body;

    // Find user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If updating password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      if (newPassword) {
        // ... check current password ...
        user.password = newPassword; // <-- LET THE PRE-SAVE HOOK HASH IT
      }
      // Hash and save new password
    }

    // Update other fields
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();
    updatedUser.password = undefined; // Remove password from response

    res.status(200).json({ 
      message: "User updated successfully", 
      user: updatedUser 
    });
  

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
}
};

const adminUpdateUserSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    "string.empty": "Full name is required."
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email format."
  }),
  phone: Joi.string().allow('').optional(),
  role: Joi.string().valid("seller", "admin").required().messages({
    "any.only": "Role must be seller or admin.",
    "string.empty": "Role is required."
  }),
  newPassword: Joi.string()
    .allow("")
    .optional()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).*$/)
    .messages({
      "string.min": "Password must be at least 6 characters.",
      "string.pattern.base": "Password must include letters, numbers, and a special character."
    })
});

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = adminUpdateUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(422).json({ errors: error.details.map(e => ({ field: e.path[0], message: e.message })) });
    }
    const { fullName, email, phone, role, newPassword } = value;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.fullName = fullName;
    user.email = email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.role = role;

    if (newPassword && newPassword.trim() !== "") {
      user.password = newPassword;
    }
    const updatedUser = await user.save();
    const userResponse = {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    };
    res.status(200).json({
      message: "User updated successfully by admin",
      user: userResponse,
    });
  } catch (error) {
    console.error('Error in updateUserByAdmin:', error);
    if (error.name === 'ValidationError') {
      return res.status(422).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// Get current user's profile
const getCurrentUser = async (req, res) => {
  try {
    // req.user should be set by authentication middleware (e.g., isUser)
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getAllUsers, deleteUser, updateUser, getCurrentUser, updateUserByAdmin };

