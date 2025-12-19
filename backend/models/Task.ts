import mongoose, { Document, Model, Schema } from 'mongoose';
import { ITask, TaskPriority, TaskStatus } from './types';

export interface ITaskDocument extends Omit<ITask, '_id'>, Document { }

const taskSchema: Schema<ITaskDocument> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 100,
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.MEDIUM,
        },
        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.TODO,
        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedToId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Task: Model<ITaskDocument> = mongoose.model<ITaskDocument>('Task', taskSchema);

export default Task;
