import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import socket from '../lib/socket';
import { cn } from '../lib/utils';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/notifications', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();

            socket.on('notificationReceived', (notif) => {
                fetchNotifications();
                // Optional: Play a sound or show a mini toast
            });

            return () => socket.off('notificationReceived');
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:4000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 focus:outline-none transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                    >
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        className={cn(
                                            "px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-none",
                                            !notif.read && "bg-indigo-50/30"
                                        )}
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "mt-1 flex-shrink-0 h-2 w-2 rounded-full",
                                                !notif.read ? "bg-indigo-600" : "bg-transparent"
                                            )} />
                                            <div className="flex-1">
                                                <p className={cn("text-xs text-gray-900", !notif.read && "font-medium")}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
