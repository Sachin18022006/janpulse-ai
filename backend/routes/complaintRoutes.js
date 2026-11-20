import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  upvoteComplaint,
  checkNearbyDuplicates,
  analyzeComplaintAI,
} from '../controllers/complaintController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Real-time pre-submission duplicate check
router.get('/nearby', checkNearbyDuplicates);

// Gemini AI image & text analysis
router.post('/ai/analyze', upload.single('image'), analyzeComplaintAI);

// Main complaint CRUD & upvote
router.route('/')
  .get(getComplaints)
  .post(protect, upload.single('image'), createComplaint);

router.route('/:id')
  .get(optionalAuth, getComplaintById);

router.post('/:id/upvote', protect, upvoteComplaint);

export default router;
