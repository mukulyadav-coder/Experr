import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/utils';
import {
    LayoutDashboard,
    CheckSquare,
    FileText,
    BarChart2,
    Award,
    Settings,
    Trophy
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Submissions', href: '/submissions', icon: FileText },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Performance', href: '/performance', icon: BarChart2 },
    { name: 'Employability Score', href: '/score', icon: Award },
];

export function Sidebar({ collapsed, setCollapsed }) {
    const location = useLocation();

    return (
        <div
            className={cn(
                "flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-dark-700 dark:bg-dark-900",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-dark-700">
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-experr-600 font-bold text-white">E</div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Experr</span>
                    </Link>
                )}
                {collapsed && (
                    <Link to="/" className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-experr-600 font-bold text-white">
                        E
                    </Link>
                )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-experr-50 text-experr-700 dark:bg-experr-900/40 dark:text-experr-400"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-800",
                                collapsed ? "justify-center" : "justify-start"
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon
                                className={cn(
                                    "shrink-0",
                                    collapsed ? "h-6 w-6" : "mr-3 h-5 w-5",
                                    isActive
                                        ? "text-experr-700 dark:text-experr-400"
                                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                                )}
                                aria-hidden="true"
                            />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 p-4 dark:border-dark-700">
                <Link
                    to="/settings"
                    className={cn(
                        "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-800 transition-colors",
                        collapsed ? "justify-center" : "justify-start"
                    )}
                    title={collapsed ? "Settings" : undefined}
                >
                    <Settings
                        className={cn(
                            "shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                            collapsed ? "h-6 w-6" : "mr-3 h-5 w-5"
                        )}
                        aria-hidden="true"
                    />
                    {!collapsed && <span>Settings</span>}
                </Link>
            </div>
        </div>
    );
}
