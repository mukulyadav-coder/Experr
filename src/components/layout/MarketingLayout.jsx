import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function MarketingLayout({ toggleTheme, isDark }) {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 transition-colors">
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-dark-800 dark:bg-dark-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-experr-600 font-bold text-white">E</div>
                        <span className="text-xl font-bold tracking-tight">Experr</span>
                    </Link>

                    <nav className="hidden md:flex gap-6">
                        <Link to="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-experr-600 dark:text-gray-300 dark:hover:text-experr-400">How It Works</Link>
                        <Link to="#roles" className="text-sm font-medium text-gray-600 hover:text-experr-600 dark:text-gray-300 dark:hover:text-experr-400">Role Tracks</Link>
                        <Link to="#features" className="text-sm font-medium text-gray-600 hover:text-experr-600 dark:text-gray-300 dark:hover:text-experr-400">Features</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={toggleTheme}>Theme</Button>
                        <Link to="/auth">
                            <Button>Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-gray-200 bg-gray-50 dark:border-dark-800 dark:bg-dark-900 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Experr. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
