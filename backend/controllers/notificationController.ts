import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';

interface AuthRequest extends Request {
    user?: any;
}

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationService.getNotifications(req.user._id);
        res.json(notifications);
    } catch (error: any) {
        next(error);
    }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationService.markAsRead(req.params.id!);
        res.json(notification);
    } catch (error: any) {
        next(error);
    }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await NotificationService.markAllAsRead(req.user._id);
        res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
        next(error);
    }
};
