import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar, Flag, User, AlertCircle, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { User as UserType, TaskPriority } from '../types';
import { cn } from '../lib/utils';
import { API_ENDPOINTS } from '../config/api';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: UserType[];
    onTaskCreated?: (task: any) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    users,
    onTaskCreated
}) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                API_ENDPOINTS.TASKS,
                {
                    title,
                    description,
                    priority,
                    dueDate: dueDate || undefined,
                    assignedToId: assignedToId || undefined,
                },
                config
            );

            if (onTaskCreated) {
                onTaskCreated(data);
            }

            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setPriority('Medium');
            setDueDate('');
            setAssignedToId('');
        } catch (error: any) {
            console.error('Error creating task:', error);
            setError(error.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal panel */}
                <div className="inline-block relative z-[101] w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Create New Task</h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-semibold text-gray-700">Task Title</label>
                            <input
                                autoFocus
                                id="title"
                                type="text"
                                placeholder="What needs to be done?"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                id="description"
                                rows={3}
                                placeholder="Add some details..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Flag className="w-4 h-4 text-gray-400" /> Priority
                                </label>
                                <select
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer text-sm font-medium"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" /> Due Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" /> Assign To
                            </label>
                            <select
                                className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer text-sm font-medium"
                                value={assignedToId}
                                onChange={(e) => setAssignedToId(e.target.value)}
                            >
                                <option value="">Self (Unassigned)</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.name} {u._id === user._id ? '(Me)' : `(${u.email})`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="flex-[2] px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Creating...' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
