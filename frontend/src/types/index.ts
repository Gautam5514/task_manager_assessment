export interface User {
    _id: string;
    name: string;
    email: string;
    token?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: User;
    assignedToId?: User;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    _id: string;
    recipientId: string | User;
    senderId?: User;
    message: string;
    read: boolean;
    type: 'Assignment' | 'System';
    link?: string;
    createdAt: string;
}
