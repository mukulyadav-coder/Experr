import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

export function AppLayout({ toggleTheme, isDark }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
            
            if (!user) {
                navigate('/auth');
            }
        };
        
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) {
                navigate('/auth');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
     }

    if (!user) {
        return null; // Will redirect to auth
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-950 transition-colors">
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar
                    toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    toggleTheme={toggleTheme}
                    isDark={isDark}
                />

                <main className="flex-1 overflow-y-auto focus:outline-none scrollbar-thin">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
