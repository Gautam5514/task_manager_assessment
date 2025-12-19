import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Plus,
    Filter,
    SortAsc,
    Clock,
    PlusCircle,
    UserCheck,
    Loader2
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import socket from '../lib/socket';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import Toast from '../components/Toast';
import { Task, User as UserType } from '../types';
import { cn } from '../lib/utils';
import { API_ENDPOINTS } from '../config/api';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [viewMode, setViewMode] = useState<'My Tasks' | 'Assigned to Me' | 'All'>('My Tasks');
    const [showOverdueOnly, setShowOverdueOnly] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(API_ENDPOINTS.TASKS, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(API_ENDPOINTS.AUTH.USERS, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    }

    useEffect(() => {
        fetchTasks();
        fetchUsers();

        if (user) {
            socket.emit('joinUserRoom', user._id);
        }

        socket.on('taskCreated', (newTask: Task) => {
            setTasks((prev) => {
                if (prev.find(t => t._id === newTask._id)) return prev;
                return [newTask, ...prev];
            });
        });

        socket.on('taskUpdated', (updatedTask: Task) => {
            setTasks((prev) =>
                prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
            );
        });

        socket.on('taskDeleted', (taskId: string) => {
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
        });

        socket.on('taskAssigned', (task: Task) => {
            setTasks((prev) => {
                const index = prev.findIndex(t => t._id === task._id);
                if (index !== -1) {
                    const newTasks = [...prev];
                    newTasks[index] = task;
                    return newTasks;
                }
                return [task, ...prev];
            });

            if (task.assignedToId?._id === user?._id) {
                setToast({ message: `New task assigned: ${task.title}`, visible: true });
            }
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
            socket.off('taskAssigned');
        };
    }, [user]);

    const filteredTasks = tasks
        .filter((task) => {
            if (filterStatus !== 'All' && task.status !== filterStatus) return false;
            if (filterPriority !== 'All' && task.priority !== filterPriority) return false;

            if (viewMode === 'My Tasks' && task.creatorId?._id !== user._id) return false;
            if (viewMode === 'Assigned to Me' && task.assignedToId?._id !== user._id) return false;

            if (showOverdueOnly) {
                if (!task.dueDate) return false;
                if (new Date(task.dueDate) >= new Date()) return false;
                if (task.status === 'Completed') return false;
            }

            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'Oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'Due Date') return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
            return 0;
        });

    const stats = {
        total: tasks.length,
        createdTasks: tasks.filter(t => t.creatorId?._id === user?._id).length,
        assignedTasks: tasks.filter(t => t.assignedToId?._id === user?._id).length,
        overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Welcome back, {user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500">Here's what's happening with your projects.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Task
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Created by Me', value: stats.createdTasks, icon: PlusCircle, color: 'indigo' },
                    { label: 'Assigned to Me', value: stats.assignedTasks, icon: UserCheck, color: 'blue' },
                    { label: 'Overdue Tasks', value: stats.overdue, icon: Clock, color: 'red' },
                    { label: 'Total Tasks', value: stats.total, icon: LayoutDashboard, color: 'emerald' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-xl transition-colors",
                            stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                                stat.color === 'red' ? "bg-red-50 text-red-600" :
                                    stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                        "bg-emerald-50 text-emerald-600"
                        )}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    {(['My Tasks', 'Assigned to Me', 'All'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                viewMode === mode ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-600 outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-600 outline-none"
                        >
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="Due Date">Due Date</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading your tasks...</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                        <PlusCircle className="w-12 h-12 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No tasks found</h3>
                    <p className="text-gray-500 max-w-xs text-center mt-1">
                        Try changing your filters or create a new task to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
                </div>
            )}

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={users}
                onTaskCreated={fetchTasks}
            />

            <Toast
                message={toast.message}
                isVisible={toast.visible}
                onClose={() => setToast({ ...toast, visible: false })}
            />
        </div>
    );
};

export default Dashboard;
