import { TaskService } from '../services/TaskService';
import Task from '../models/Task';
import { TaskStatus, TaskPriority } from '../models/types';

jest.mock('../models/Task');

describe('TaskService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create a task successfully', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                priority: TaskPriority.MEDIUM,
            };
            const creatorId = 'user123';

            const saveSpy = jest.fn().mockResolvedValue({
                _id: 'task123',
                ...taskData,
                creatorId,
                status: TaskStatus.TODO,
            });

            (Task as any).mockImplementation(() => ({
                save: saveSpy,
            }));

            const result = await TaskService.createTask(taskData as any, creatorId);

            expect(Task).toHaveBeenCalledWith({
                ...taskData,
                creatorId,
                status: TaskStatus.TODO,
            });
            expect(saveSpy).toHaveBeenCalled();
            expect(result._id).toBe('task123');
        });
    });

    describe('getTasks', () => {
        it('should fetch tasks with population and sorting', async () => {
            const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];

            const populateSpy = jest.fn().mockReturnThis();
            const sortSpy = jest.fn().mockResolvedValue(mockTasks);

            (Task.find as jest.Mock).mockReturnValue({
                populate: populateSpy,
                sort: sortSpy,
            });

            const result = await TaskService.getTasks({});

            expect(Task.find).toHaveBeenCalledWith({});
            expect(populateSpy).toHaveBeenCalledWith('assignedToId', 'name email');
            expect(populateSpy).toHaveBeenCalledWith('creatorId', 'name email');
            expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result).toEqual(mockTasks);
        });
    });
});
