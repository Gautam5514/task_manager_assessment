export interface IUser {
    _id?: any;
    name: string;
    email: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    URGENT = 'Urgent',
}

export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    REVIEW = 'Review',
    COMPLETED = 'Completed',
}

export interface ITask {
    _id?: any;
    title: string;
    description?: string;
    dueDate?: Date;
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: any;
    assignedToId?: any;
    createdAt?: string;
    updatedAt?: string;
}

export interface INotification {
    _id?: any;
    recipientId: any;
    senderId?: any;
    message: string;
    read: boolean;
    type: 'Assignment' | 'System';
    link?: string;
    createdAt?: string;
    updatedAt?: string;
}
