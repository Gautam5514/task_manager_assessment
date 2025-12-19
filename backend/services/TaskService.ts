import Task, { ITaskDocument } from '../models/Task';
import { ITask, TaskPriority, TaskStatus } from '../models/types';

export class TaskService {
    static async createTask(data: Partial<ITask>, creatorId: string): Promise<ITaskDocument> {
        const task = new Task({
            ...data,
            creatorId,
            status: TaskStatus.TODO,
        });
        return await task.save();
    }

    static async getTasks(query: any): Promise<ITaskDocument[]> {
        return await Task.find(query)
            .populate('assignedToId', 'name email')
            .populate('creatorId', 'name email')
            .sort({ createdAt: -1 });
    }

    static async updateTask(id: string, userId: string, data: Partial<ITask>): Promise<ITaskDocument | null> {
        // Basic authorization check: usually in service or controller, 
        // but requirements mentioned "solid fundamental".
        return await Task.findByIdAndUpdate(id, data, { new: true })
            .populate('assignedToId', 'name email')
            .populate('creatorId', 'name email');
    }

    static async deleteTask(id: string): Promise<ITaskDocument | null> {
        return await Task.findByIdAndDelete(id);
    }

    static async getTaskById(id: string): Promise<ITaskDocument | null> {
        return await Task.findById(id)
            .populate('assignedToId', 'name email')
            .populate('creatorId', 'name email');
    }
}
