import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-6 right-6 z-[1000] flex items-center gap-4 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-4">
                        <p className="text-sm font-semibold">New Notification</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 rounded-b-2xl overflow-hidden">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-indigo-400"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
