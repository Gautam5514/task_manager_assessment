import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, LogOut, CheckSquare } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';
import { cn } from '../lib/utils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Profile', path: '/profile', icon: UserIcon },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                                <CheckSquare className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                TaskFlow
                            </span>
                        </Link>

                        <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={cn(
                                            "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "text-indigo-600 bg-indigo-50"
                                                : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <NotificationDropdown />

                        <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />

                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                            </div>

                            <button
                                onClick={logout}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
