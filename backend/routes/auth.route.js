import express from 'express'
import { login, signUp, logout } from '../controllers/auth.controller.js'
import { protect, authorize } from '../middlewares/authMiddleware.js'
import { signupValidator, loginValidator } from '../middlewares/validators.js'
import { getCurrentUser } from '../controllers/user.controller.js'

const router = express.Router()

// Public routes
router.post("/signup", signupValidator, signUp)
router.post("/login", loginValidator, login)
router.post("/logout", logout);

// User routes
router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    fullName: req.user.fullName,
    phone: req.user.phone,
  });
});

// Admin routes
router.get("/admin", protect, authorize('admin'), (req, res) => {
  res.status(200).json({ message: "Admin Dashboard", user: req.user })
})

router.get("/admin/me", protect, authorize('admin'), getCurrentUser);

export default router