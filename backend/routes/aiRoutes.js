import express from 'express';
import { analyzeComplaintAI } from '../controllers/complaintController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// POST /api/ai/analyze
router.post('/analyze', upload.single('image'), analyzeComplaintAI);

export default router;
