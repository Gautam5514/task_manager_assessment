import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/types';

export const CreateTaskDto = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    dueDate: z.string().optional().or(z.date()),
    priority: z.nativeEnum(TaskPriority).optional(),
    assignedToId: z.string().optional(),
});

export const UpdateTaskDto = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    dueDate: z.string().optional().or(z.date()),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: z.string().optional(),
});

export type CreateTaskDtoType = z.infer<typeof CreateTaskDto>;
export type UpdateTaskDtoType = z.infer<typeof UpdateTaskDto>;
