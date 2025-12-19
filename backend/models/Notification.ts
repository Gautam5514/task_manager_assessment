import mongoose, { Document, Model, Schema } from 'mongoose';
import { INotification } from './types';

export interface INotificationDocument extends Omit<INotification, '_id'>, Document { }

const notificationSchema: Schema<INotificationDocument> = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ['Assignment', 'System'],
            default: 'System',
        },
        link: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Notification: Model<INotificationDocument> = mongoose.model<INotificationDocument>(
    'Notification',
    notificationSchema
);

export default Notification;
