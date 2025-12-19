import express from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTasks as any).post(protect, createTask as any);
router
    .route('/:id')
    .put(protect, updateTask as any)
    .delete(protect, deleteTask as any);

export default router;
