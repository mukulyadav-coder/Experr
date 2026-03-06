import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export function AppLayout({ toggleTheme, isDark }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
