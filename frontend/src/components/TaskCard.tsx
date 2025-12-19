import React from 'react';
import {
    Calendar,
    Flag,
    MoreVertical,
    CheckCircle2,
    Clock,
    User as UserIcon
} from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const priorityColors = {
        Low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
        Medium: 'bg-amber-50 text-amber-700 ring-amber-600/10',
        High: 'bg-orange-50 text-orange-700 ring-orange-600/10',
        Urgent: 'bg-rose-50 text-rose-700 ring-rose-600/10',
    };

    const statusColors = {
        'To Do': 'bg-gray-50 text-gray-600 ring-gray-600/10',
        'In Progress': 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
        'Review': 'bg-purple-50 text-purple-700 ring-purple-600/10',
        'Completed': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 relative">
            <div className="flex justify-between items-start mb-4">
                <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
                    priorityColors[task.priority]
                )}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                </span>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {task.title}
            </h3>

            {task.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {task.description}
                </p>
            )}

            <div className="space-y-3 pt-4 border-t border-gray-50 text-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 gap-2">
                        <Calendar className={cn("w-4 h-4", isOverdue ? "text-rose-500" : "text-gray-400")} />
                        <span className={cn(isOverdue && "text-rose-600 font-medium whitespace-nowrap")}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            {isOverdue && ' (Overdue)'}
                        </span>
                    </div>

                    <div className={cn(
                        "flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                        statusColors[task.status]
                    )}>
                        {task.status === 'Completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {task.status}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-indigo-600" />
                        </div>
                        <span className="text-gray-600 text-sm font-medium">
                            {task.assignedToId?.name || 'Unassigned'}
                        </span>
                    </div>

                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-50 border border-white flex items-center justify-center text-[10px] font-bold text-gray-400" title={`Created by ${task.creatorId?.name}`}>
                            {task.creatorId?.name?.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
