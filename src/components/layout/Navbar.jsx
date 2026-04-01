import React, { useState, useEffect, useRef } from 'react';
import { Bell, Moon, Sun, Menu, Coins, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../ui/Button';

export function Navbar({ toggleSidebar, toggleTheme, isDark }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                            setProfile({ ...newProfile, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`, email: user.email, id: user.id });
                        }
                    } else if (!error) {
                        setProfile({ ...data, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`, email: user.email, id: user.id });
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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
        // Optionally redirect to login page
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

                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5" aria-hidden="true" />
                        <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-900" />
                    </button>

                    {/* Coins Display */}
                    <div className="hidden lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-1.5 lg:rounded-full lg:bg-transparent lg:border-0 hover:lg:px-4 transition-all duration-300 group">
                        <span className="text-sm font-bold text-black hidden group-hover:inline transition-all duration-300">Experr</span>
                        <img src="/coin.svg" alt="coins" className="h-5 w-5" />
                        <span className="text-sm font-semibold text-amber-500">{profile?.coins || 0}</span>
                    </div>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-dark-700" aria-hidden="true" />

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-md dark:hover:bg-dark-800 transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                            </span>
                        </button>
                        {isDropdownOpen && (
                            <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 border border-gray-200 dark:border-dark-700">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <img className="h-12 w-12 rounded-full ring-2 ring-gray-200 dark:ring-dark-600" src={profile?.avatarUrl} alt="" />
                                        <div className="ml-4">
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">{profile?.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <Coins className="h-4 w-4 mr-2 text-amber-500" />
                                            <span>Coins: <span className="font-semibold text-amber-600">{profile?.coins}</span></span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <User className="h-4 w-4 mr-2 text-blue-500" />
                                            <span>ID: <span className="font-mono text-xs">{profile?.id}</span></span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex space-x-3">
                                        <Button variant="outline" size="sm" className="hover:bg-gray-50 dark:hover:bg-dark-700 hover:shadow-md transition-all duration-200" disabled>Edit Profile</Button>
                                        <Button variant="outline" size="sm" className="hover:bg-red-50 dark:hover:bg-red-900 hover:shadow-md transition-all duration-200" onClick={handleLogout}>Logout</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
