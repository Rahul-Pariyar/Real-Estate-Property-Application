import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

// Get all notifications for the logged-in admin
router.get("/", protect, authorize('admin'), getNotifications);

// Mark notification as read
router.patch("/:id/read", protect, authorize('admin'), markAsRead);

export default router;
