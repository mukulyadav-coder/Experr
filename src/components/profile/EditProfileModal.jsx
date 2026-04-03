import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, user, onSave, loading }) {
  const [form, setForm] = useState({ name: '', username: '', bio: '', avatar_url: '', github: '', linkedin: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
      });
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username) {
      setError('Name and username are required.');
      return;
    }
    await onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500">Name</label>
            <input value={form.name} onChange={handleChange('name')} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Username</label>
            <input value={form.username} onChange={handleChange('username')} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Bio</label>
            <textarea value={form.bio} onChange={handleChange('bio')} rows={3} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Avatar URL</label>
            <input value={form.avatar_url} onChange={handleChange('avatar_url')} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">GitHub</label>
            <input value={form.github} onChange={handleChange('github')} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">LinkedIn</label>
            <input value={form.linkedin} onChange={handleChange('linkedin')} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
