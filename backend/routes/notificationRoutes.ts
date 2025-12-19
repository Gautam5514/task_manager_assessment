import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getNotifications as any);
router.put('/:id/read', protect, markAsRead as any);
router.put('/read-all', protect, markAllAsRead as any);

export default router;
