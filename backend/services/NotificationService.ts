import Notification, { INotificationDocument } from '../models/Notification';
import { INotification } from '../models/types';

export class NotificationService {
    static async createNotification(data: Partial<INotification>): Promise<INotificationDocument> {
        const notification = new Notification(data);
        return await notification.save();
    }

    static async getNotifications(recipientId: string): Promise<INotificationDocument[]> {
        return await Notification.find({ recipientId })
            .populate('senderId', 'name email')
            .sort({ createdAt: -1 })
            .limit(50);
    }

    static async markAsRead(id: string): Promise<INotificationDocument | null> {
        return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }

    static async markAllAsRead(recipientId: string): Promise<any> {
        return await Notification.updateMany({ recipientId, read: false }, { read: true });
    }
}
