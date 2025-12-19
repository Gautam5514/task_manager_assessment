import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { NotificationService } from '../services/NotificationService';
import { TaskStatus } from '../models/types';

// Extend Request to include user
interface AuthRequest extends Request {
    user?: any;
    app: any;
}

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const io = req.app.get('io');
    const { title, description, dueDate, priority, assignedToId } = req.body;

    try {
        const task = await TaskService.createTask({
            title,
            description,
            dueDate,
            priority,
            assignedToId,
        }, req.user._id);

        const populatedTask = await TaskService.getTaskById(task._id.toString());

        io.emit('taskCreated', populatedTask);
        if (assignedToId) {
            await NotificationService.createNotification({
                recipientId: assignedToId,
                senderId: req.user._id,
                message: `You have been assigned a new task: ${populatedTask?.title}`,
                type: 'Assignment',
                link: `/tasks/${populatedTask?._id}`
            });
            io.to(`user:${assignedToId}`).emit('notificationReceived', {
                message: `New task assigned: ${populatedTask?.title}`
            });
            io.to(`user:${assignedToId}`).emit('taskAssigned', populatedTask);
        }

        res.status(201).json(populatedTask);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tasks = await TaskService.getTasks({});
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const io = req.app.get('io');
    const { id } = req.params;

    try {
        const updatedTask = await TaskService.updateTask(id!, req.user._id, req.body);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        io.emit('taskUpdated', updatedTask);

        // If assignee changed, notifying the new one
        if (req.body.assignedToId && req.body.assignedToId !== (updatedTask.assignedToId as any)?._id?.toString()) {
            await NotificationService.createNotification({
                recipientId: req.body.assignedToId,
                senderId: req.user._id,
                message: `You have been assigned to task: ${updatedTask.title}`,
                type: 'Assignment',
            });
            io.to(`user:${req.body.assignedToId}`).emit('notificationReceived', {
                message: `Task assigned: ${updatedTask.title}`
            });
            io.to(`user:${req.body.assignedToId}`).emit('taskAssigned', updatedTask);
        }

        res.json(updatedTask);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const io = req.app.get('io');
    const { id } = req.params;

    try {
        const task = await TaskService.deleteTask(id!);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        io.emit('taskDeleted', id);
        res.json({ message: 'Task removed' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
