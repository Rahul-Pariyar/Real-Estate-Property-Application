import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { submitContact, getAllContacts } from '../controllers/contact.controller.js';

const router = express.Router();

// Public: submit contact form
router.post('/create', submitContact);

// Admin: get all contacts
router.get('/all', protect, authorize('admin'), getAllContacts);

export default router;
