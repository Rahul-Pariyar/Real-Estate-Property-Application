import express from 'express'
import { protect, authorize } from '../middlewares/authMiddleware.js'
import { getAll, createProperty, deleteProperty, getPropertyById, updateProperty, getAllActive, setPropertyStatus, getLatestActive } from '../controllers/property.controller.js'
import upload from '../config/multer.js'

const router = express.Router()

// Public routes
router.get('/public/all', getAllActive);
router.get('/public/latest', getLatestActive);

// Protected routes
router.get('/getAll', protect, getAll);
router.post('/create', protect, upload.array('images', 5), createProperty)

// Admin only
router.delete('/delete/:id', protect, authorize('admin'), deleteProperty)
router.put('/edit/:id', protect, authorize('admin'), upload.array('images', 5), updateProperty)
router.patch('/status/:id', protect, authorize('admin'), setPropertyStatus);

// Public - MUST BE LAST (catch-all route)
router.get('/:id', getPropertyById)

export default router