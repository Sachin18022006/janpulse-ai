import express from 'express';
import {
  getAdminComplaints,
  updateComplaintStatus,
  assignDepartment,
  getAdminUsers,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Protect all admin routes for admin role only
router.use(protect);
router.use(authorize('admin'));

router.get('/complaints', getAdminComplaints);
router.put('/complaints/:id/status', upload.single('resolutionProof'), updateComplaintStatus);
router.put('/complaints/:id/assign', assignDepartment);
router.get('/users', getAdminUsers);

export default router;
