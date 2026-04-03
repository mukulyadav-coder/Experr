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


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/Button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
// import { signUp, signIn } from '../../lib/supabase.js';

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

//   .auth-root {
//     font-family: 'DM Sans', sans-serif;
//     min-height: 100vh;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: #050510;
//     position: relative;
//     overflow: hidden;
//     padding: 2rem 1rem;
//   }

//   /* Animated gradient orbs */
//   .auth-root::before {
//     content: '';
//     position: fixed;
//     top: -20%;
//     left: -10%;
//     width: 60vw;
//     height: 60vw;
//     background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
//     border-radius: 50%;
//     animation: orbFloat1 12s ease-in-out infinite alternate;
//     pointer-events: none;
//     z-index: 0;
//   }
//   .auth-root::after {
//     content: '';
//     position: fixed;
//     bottom: -20%;
//     right: -10%;
//     width: 55vw;
//     height: 55vw;
//     background: radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%);
//     border-radius: 50%;
//     animation: orbFloat2 14s ease-in-out infinite alternate;
//     pointer-events: none;
//     z-index: 0;
//   }

//   @keyframes orbFloat1 {
//     from { transform: translate(0, 0) scale(1); }
//     to   { transform: translate(4%, 6%) scale(1.08); }
//   }
//   @keyframes orbFloat2 {
//     from { transform: translate(0, 0) scale(1); }
//     to   { transform: translate(-5%, -4%) scale(1.1); }
//   }

//   /* Grid lines background */
//   .auth-grid {
//     position: fixed;
//     inset: 0;
//     background-image:
//       linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
//     background-size: 48px 48px;
//     z-index: 0;
//     pointer-events: none;
//   }

//   .auth-container {
//     position: relative;
//     z-index: 1;
//     width: 100%;
//     max-width: 440px;
//   }

//   /* Brand badge */
//   .auth-brand {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-bottom: 2rem;
//     animation: fadeSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
//   }

//   .auth-logo-ring {
//     width: 56px;
//     height: 56px;
//     border-radius: 16px;
//     background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin-bottom: 1rem;
//     box-shadow: 0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(168,85,247,0.2);
//     position: relative;
//   }
//   .auth-logo-ring::after {
//     content: '';
//     position: absolute;
//     inset: -2px;
//     border-radius: 18px;
//     border: 1.5px solid rgba(255,255,255,0.15);
//   }
//   .auth-logo-letter {
//     font-family: 'Syne', sans-serif;
//     font-weight: 800;
//     font-size: 1.6rem;
//     color: white;
//     letter-spacing: -1px;
//   }

//   .auth-title {
//     font-family: 'Syne', sans-serif;
//     font-weight: 800;
//     font-size: 2rem;
//     color: #fff;
//     letter-spacing: -0.04em;
//     text-align: center;
//     line-height: 1.1;
//   }
//   .auth-title span {
//     background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//   }

//   .auth-subtitle {
//     margin-top: 0.45rem;
//     font-size: 0.875rem;
//     color: rgba(255,255,255,0.42);
//     text-align: center;
//     letter-spacing: 0.01em;
//   }

//   /* Card */
//   .auth-card {
//     background: rgba(255,255,255,0.04);
//     border: 1px solid rgba(255,255,255,0.09);
//     border-radius: 20px;
//     backdrop-filter: blur(24px);
//     -webkit-backdrop-filter: blur(24px);
//     padding: 2rem;
//     box-shadow:
//       0 4px 6px rgba(0,0,0,0.4),
//       0 20px 60px rgba(0,0,0,0.5),
//       inset 0 1px 0 rgba(255,255,255,0.08);
//     animation: fadeSlideUp 0.7s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
//   }

//   @keyframes fadeSlideDown {
//     from { opacity: 0; transform: translateY(-18px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes fadeSlideUp {
//     from { opacity: 0; transform: translateY(18px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }

//   /* Tabs */
//   .custom-tabs-list {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     background: rgba(255,255,255,0.05);
//     border-radius: 10px;
//     padding: 3px;
//     gap: 3px;
//     margin-bottom: 1.5rem;
//   }
//   .custom-tab-trigger {
//     padding: 0.55rem 1rem;
//     border-radius: 8px;
//     border: none;
//     background: transparent;
//     color: rgba(255,255,255,0.45);
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.875rem;
//     font-weight: 500;
//     cursor: pointer;
//     transition: all 0.22s ease;
//     letter-spacing: 0.01em;
//   }
//   .custom-tab-trigger:hover {
//     color: rgba(255,255,255,0.75);
//   }
//   .custom-tab-trigger.active {
//     background: linear-gradient(135deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8));
//     color: #fff;
//     box-shadow: 0 2px 12px rgba(99,102,241,0.4);
//   }

//   /* Input */
//   .input-group {
//     margin-bottom: 1rem;
//   }
//   .input-label {
//     display: block;
//     font-size: 0.78rem;
//     font-weight: 500;
//     color: rgba(255,255,255,0.55);
//     margin-bottom: 0.4rem;
//     letter-spacing: 0.04em;
//     text-transform: uppercase;
//   }
//   .input-field {
//     width: 100%;
//     box-sizing: border-box;
//     padding: 0.7rem 1rem;
//     background: rgba(255,255,255,0.06);
//     border: 1px solid rgba(255,255,255,0.1);
//     border-radius: 10px;
//     color: #fff;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.925rem;
//     outline: none;
//     transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
//   }
//   .input-field::placeholder {
//     color: rgba(255,255,255,0.22);
//   }
//   .input-field:focus {
//     border-color: rgba(99,102,241,0.7);
//     box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
//     background: rgba(255,255,255,0.09);
//   }

//   /* Primary button */
//   .btn-primary {
//     width: 100%;
//     padding: 0.75rem 1.5rem;
//     background: linear-gradient(135deg, #6366f1, #a855f7);
//     color: #fff;
//     font-family: 'Syne', sans-serif;
//     font-weight: 700;
//     font-size: 0.95rem;
//     letter-spacing: 0.03em;
//     border: none;
//     border-radius: 10px;
//     cursor: pointer;
//     margin-top: 0.5rem;
//     transition: all 0.22s ease;
//     position: relative;
//     overflow: hidden;
//     box-shadow: 0 4px 20px rgba(99,102,241,0.35);
//   }
//   .btn-primary::after {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
//     opacity: 0;
//     transition: opacity 0.2s;
//   }
//   .btn-primary:hover {
//     transform: translateY(-1px);
//     box-shadow: 0 6px 28px rgba(99,102,241,0.5);
//   }
//   .btn-primary:hover::after { opacity: 1; }
//   .btn-primary:active { transform: translateY(0); }

//   /* Google button */
//   .btn-google {
//     width: 100%;
//     padding: 0.7rem 1.5rem;
//     background: rgba(255,255,255,0.06);
//     color: rgba(255,255,255,0.8);
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 500;
//     font-size: 0.9rem;
//     border: 1px solid rgba(255,255,255,0.12);
//     border-radius: 10px;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 0.6rem;
//     transition: all 0.2s ease;
//   }
//   .btn-google:hover {
//     background: rgba(255,255,255,0.1);
//     border-color: rgba(255,255,255,0.2);
//     color: #fff;
//   }

//   /* Ghost / skip button */
//   .btn-ghost {
//     width: 100%;
//     padding: 0.6rem 1rem;
//     background: transparent;
//     border: none;
//     color: rgba(255,255,255,0.3);
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.83rem;
//     cursor: pointer;
//     transition: color 0.2s;
//     letter-spacing: 0.01em;
//   }
//   .btn-ghost:hover { color: rgba(255,255,255,0.6); }

//   /* Divider */
//   .divider {
//     display: flex;
//     align-items: center;
//     gap: 0.75rem;
//     margin: 1.25rem 0;
//   }
//   .divider-line {
//     flex: 1;
//     height: 1px;
//     background: rgba(255,255,255,0.08);
//   }
//   .divider-text {
//     font-size: 0.75rem;
//     color: rgba(255,255,255,0.28);
//     letter-spacing: 0.06em;
//     text-transform: uppercase;
//   }

//   /* Error */
//   .error-box {
//     padding: 0.7rem 1rem;
//     background: rgba(239,68,68,0.12);
//     border: 1px solid rgba(239,68,68,0.3);
//     border-radius: 8px;
//     color: #fca5a5;
//     font-size: 0.85rem;
//     margin-top: 1rem;
//   }

//   /* Shimmer on card top border */
//   .card-shimmer {
//     height: 2px;
//     width: 100%;
//     background: linear-gradient(90deg, transparent, #818cf8, #c084fc, #f472b6, transparent);
//     border-radius: 20px 20px 0 0;
//     margin-bottom: -1px;
//     opacity: 0.7;
//   }
// `;

// export default function Auth() {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('signup');
//     const [error, setError] = useState('');
//     const [formData, setFormData] = useState({ name: '', email: '', password: '' });

//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSignUp = async (e) => {
//         e.preventDefault();
//         setError('');
//         const { data, error } = await signUp(formData.email, formData.password, formData.name);
//         if (error) setError(error.message);
//         else navigate('/dashboard');
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError('');
//         const { data, error } = await signIn(formData.email, formData.password);
//         if (error) setError(error.message);
//         else navigate('/dashboard');
//     };

//     const handleGoogleAuth = () => {
//         console.log('Google auth');
//         navigate('/dashboard');
//     };

//     const handleSkip = () => navigate('/dashboard');

//     return (
//         <>
//             <style>{styles}</style>
//             <div className="auth-root">
//                 <div className="auth-grid" />

//                 <div className="auth-container">
//                     {/* Brand */}
//                     <div className="auth-brand">
//                         <div className="auth-logo-ring">
//                             <span className="auth-logo-letter">E</span>
//                         </div>
//                         <h1 className="auth-title">
//                             Welcome to <span>Experr</span>
//                         </h1>
//                         <p className="auth-subtitle">Sign up or sign in to access simulations</p>
//                     </div>

//                     {/* Card */}
//                     <div>
//                         <div className="card-shimmer" />
//                         <div className="auth-card">

//                             {/* Custom Tabs */}
//                             <div className="custom-tabs-list">
//                                 <button
//                                     className={`custom-tab-trigger ${activeTab === 'signup' ? 'active' : ''}`}
//                                     onClick={() => { setActiveTab('signup'); setError(''); }}
//                                 >
//                                     Sign Up
//                                 </button>
//                                 <button
//                                     className={`custom-tab-trigger ${activeTab === 'login' ? 'active' : ''}`}
//                                     onClick={() => { setActiveTab('login'); setError(''); }}
//                                 >
//                                     Login
//                                 </button>
//                             </div>

//                             {/* Sign Up Form */}
//                             {activeTab === 'signup' && (
//                                 <form onSubmit={handleSignUp}>
//                                     <div className="input-group">
//                                         <label htmlFor="name" className="input-label">Name</label>
//                                         <input
//                                             id="name" name="name" type="text" required
//                                             value={formData.name} onChange={handleInputChange}
//                                             className="input-field" placeholder="Your full name"
//                                         />
//                                     </div>
//                                     <div className="input-group">
//                                         <label htmlFor="email" className="input-label">Email</label>
//                                         <input
//                                             id="email" name="email" type="email" required
//                                             value={formData.email} onChange={handleInputChange}
//                                             className="input-field" placeholder="your@email.com"
//                                         />
//                                     </div>
//                                     <div className="input-group">
//                                         <label htmlFor="password" className="input-label">Password</label>
//                                         <input
//                                             id="password" name="password" type="password" required
//                                             value={formData.password} onChange={handleInputChange}
//                                             className="input-field" placeholder="Create a password"
//                                         />
//                                     </div>
//                                     <button type="submit" className="btn-primary">Create Account →</button>
//                                 </form>
//                             )}

//                             {/* Login Form */}
//                             {activeTab === 'login' && (
//                                 <form onSubmit={handleLogin}>
//                                     <div className="input-group">
//                                         <label htmlFor="login-email" className="input-label">Email</label>
//                                         <input
//                                             id="login-email" name="email" type="email" required
//                                             value={formData.email} onChange={handleInputChange}
//                                             className="input-field" placeholder="your@email.com"
//                                         />
//                                     </div>
//                                     <div className="input-group">
//                                         <label htmlFor="login-password" className="input-label">Password</label>
//                                         <input
//                                             id="login-password" name="password" type="password" required
//                                             value={formData.password} onChange={handleInputChange}
//                                             className="input-field" placeholder="Your password"
//                                         />
//                                     </div>
//                                     <button type="submit" className="btn-primary">Sign In →</button>
//                                 </form>
//                             )}

//                             {/* Divider */}
//                             <div className="divider">
//                                 <div className="divider-line" />
//                                 <span className="divider-text">or</span>
//                                 <div className="divider-line" />
//                             </div>

//                             {/* Google */}
//                             <button className="btn-google" onClick={handleGoogleAuth}>
//                                 <svg width="18" height="18" viewBox="0 0 24 24">
//                                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                                 </svg>
//                                 Continue with Google
//                             </button>

//                             {/* Error */}
//                             {error && <div className="error-box">{error}</div>}

//                             {/* Skip */}
//                             <div className="divider" style={{marginTop: '1rem', marginBottom: '0.25rem'}}>
//                                 <div className="divider-line" />
//                                 <span className="divider-text">or</span>
//                                 <div className="divider-line" />
//                             </div>
//                             <button className="btn-ghost" onClick={handleSkip}>
//                                 Skip for now
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }