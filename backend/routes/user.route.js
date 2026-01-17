import express from 'express'
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { updateValidator } from '../middlewares/validators.js';
import { getAllUsers, deleteUser, updateUser, getCurrentUser, updateUserByAdmin } from '../controllers/user.controller.js'

const router = express.Router()

// User profile routes
router.get("/me", protect, getCurrentUser);
router.put("/profile/:id", protect, updateValidator, updateUser);

// Admin only
router.get("/all", protect, authorize('admin'), getAllUsers);
router.delete("/delete/:id", protect, authorize('admin'), deleteUser);
router.put("/edit/:id", protect, authorize('admin'), updateValidator, updateUserByAdmin);

export default router