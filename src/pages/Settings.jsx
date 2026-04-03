import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Application settings and preferences</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
          Back to Profile
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings Coming Soon</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">This section is a placeholder. Add settings features here as needed.</p>
      </div>
    </div>
  );
}
