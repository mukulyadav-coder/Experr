import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

const RecruiterAuth = ({ onBack }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    console.log('Recruiter', mode, formData);
    alert('Recruiter ' + (mode === 'login' ? 'login' : 'signup') + ' (demo only)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-dark-700 dark:bg-dark-900 transition-all">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-experr-600">Recruiter Portal</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{mode === 'login' ? 'Recruiter Login' : 'Recruiter Signup'}</h1>
            </div>
            <span className="h-10 w-10 rounded-full bg-experr-100 text-experr-600 flex items-center justify-center text-lg font-bold">R</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                  placeholder="Acme Inc."
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                placeholder="recruiter@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                placeholder="********"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-experr-500 focus:border-experr-500 dark:bg-dark-800 dark:border-dark-700 dark:text-white"
                  placeholder="********"
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              {mode === 'login' ? 'Login' : 'Create Recruiter Account'}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <button
              className="text-sm text-experr-600 hover:text-experr-700"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Switch to Signup' : 'Switch to Login'}
            </button>
            <button
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onBack}
            >
              Back to User Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterAuth;
