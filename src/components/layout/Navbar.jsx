import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Menu, Coins, ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../ui/Button';
import { useCampus } from '../../context/CampusContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { colleges } from '../../data/campusArenaData';

export function Navbar({ toggleSidebar, toggleTheme, isDark }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { selectedCollege, switchCollege } = useCampus();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Only show campus info on Campus Arena pages
    const isCampusPage = location.pathname.includes('/campus');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('name, coins')
                        .eq('id', user.id)
                        .single();
                    
                    if (error && error.code === 'PGRST116') {
                        // Profile doesn't exist, create one
                        const { error: insertError } = await supabase
                            .from('profiles')
                            .insert([{
                                id: user.id,
                                name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                                coins: 0,
                                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                            }]);
                        
                        if (!insertError) {
                            // Fetch the newly created profile
                            const { data: newProfile } = await supabase
                                .from('profiles')
                                .select('name, coins')
                                .eq('id', user.id)
                                .single();
                            setProfile({ ...newProfile, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` });
                        }
                    } else if (!error) {
                        setProfile({ ...data, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` });
                    }
                }
            } catch (err) {
                console.error('Error fetching/creating profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Fetch notifications from Supabase
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('notifications')
                        .select('id, message, type, created_at')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(10);
                    
                    if (!error && data) {
                        // Transform timestamps to readable format
                        const formattedNotifications = data.map(notif => ({
                            ...notif,
                            time: formatTimeAgo(notif.created_at)
                        }));
                        setNotifications(formattedNotifications);
                    }
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        fetchNotifications();

        // Optional: Set up real-time subscription for live notifications
        const subscription = supabase
            .channel('notifications')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    const newNotif = {
                        ...payload.new,
                        time: formatTimeAgo(payload.new.created_at)
                    };
                    setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Helper function to format timestamp
    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return <div>Loading...</div>; // Or a skeleton
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-dark-700 dark:bg-dark-900 transition-colors">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 xl:hidden dark:text-gray-300"
                onClick={toggleSidebar}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center">
                    {/* Optional Global Search could go here */}
                </div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDark ? (
                            <Sun className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                    </Button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-label="Toggle notifications"
                        >
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-5 w-5" aria-hidden="true" />
                            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-900" />
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 z-50">
                                {/* Header */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                        onClick={() => setShowNotifications(false)}
                                        aria-label="Close notifications"
                                    >
                                        <span className="text-lg">×</span>
                                    </button>
                                </div>

                                {/* Notifications List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="px-4 py-3 border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors cursor-pointer last:border-b-0"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                                        notif.type === 'success' ? 'bg-green-500' :
                                                        notif.type === 'reward' ? 'bg-amber-500' :
                                                        'bg-blue-500'
                                                    }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{notif.message}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-700 text-center">
                                    <button className="text-sm text-experr-600 hover:text-experr-700 dark:text-experr-400 dark:hover:text-experr-300 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coins Display */}
                    <div className="hidden lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-1.5 lg:rounded-full lg:bg-transparent lg:border-0 hover:lg:px-4 transition-all duration-300 group">
                        <span className="text-sm font-bold text-black hidden group-hover:inline transition-all duration-300">Experr</span>
                        <img src="/coin.svg" alt="coins" className="h-5 w-5" />
                        <span className="text-sm font-semibold text-amber-500">{profile?.coins || 0}</span>
                    </div>

                    {/* Campus Switch - Only on Campus Pages */}
                    {selectedCollege && isCampusPage && (
                        <div className="relative hidden lg:block">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-dark-800 transition-colors"
                                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                            >
                                <span>Campus: {selectedCollege.name}</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {showCampusDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-md shadow-lg border border-gray-200 dark:border-dark-600 z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-dark-600">
                                            Switch Campus
                                        </div>
                                        {colleges.map((college) => (
                                            <button
                                                key={college.id}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
                                                onClick={() => {
                                                    switchCollege(college.id);
                                                    setShowCampusDropdown(false);
                                                    navigate('/campus-arena');
                                                }}
                                            >
                                                <div className="font-medium">{college.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{college.location}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Separator - Only show when campus is displayed */}
                    {selectedCollege && isCampusPage && (
                        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-dark-700" aria-hidden="true" />
                    )}

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-md dark:hover:bg-dark-800 transition-colors"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            aria-label="Open user menu"
                        >
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="h-8 w-8 rounded-full bg-gray-50 dark:bg-dark-800"
                                src={profile?.avatarUrl}
                                alt=""
                            />
                            <span className="hidden lg:flex lg:items-center">
                                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
                                    {profile?.name}
                                </span>
                                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                            </span>
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg border border-gray-200 dark:border-dark-600 z-50">
                                <div className="py-1">
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
                                        onClick={() => {
                                            navigate('/profile');
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
                                        onClick={() => {
                                            navigate('/settings');
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        Settings
                                    </button>
                                    <div className="border-t border-gray-200 dark:border-dark-700 my-1" />
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            navigate('/');
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
