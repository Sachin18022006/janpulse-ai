import express from 'express';
import { getDashboardStats, getDashboardAnalytics } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/analytics', getDashboardAnalytics);

export default router;
