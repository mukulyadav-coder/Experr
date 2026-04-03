import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { signUp, signIn } from '../../lib/supabase.js';
import RecruiterAuth from './RecruiterAuth';

export default function Auth() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('signup');
    const [error, setError] = useState('');
    const [showRecruiter, setShowRecruiter] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        
        const { data, error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
    };

    const handleGoogleAuth = () => {
        // TODO: Implement Google OAuth
        console.log('Google auth');
        // For now, just navigate to dashboard
        navigate('/dashboard');
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
            {showRecruiter ? (
                <RecruiterAuth onBack={() => setShowRecruiter(false)} />
            ) : (
                <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome to Experr
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign up or sign in to access simulations
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Get Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                <TabsTrigger value="login">Login</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signup" className="space-y-4 mt-6">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                                            placeholder="Create a password"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="login" className="space-y-4 mt-6">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            id="login-email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <input
                                            id="login-password"
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                                            placeholder="Your password"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-dark-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleGoogleAuth}
                            className="w-full flex items-center justify-center gap-2 mt-4"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative mt-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-dark-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            onClick={handleSkip}
                            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mt-4"
                        >
                            Skip for now
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => setShowRecruiter(true)}
                            className="w-full mt-2"
                        >
                            Login as Recruiter
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
        </div>
    );
}