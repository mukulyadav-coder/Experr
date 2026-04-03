import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Github, Linkedin, Copy, Edit3 } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function ProfileHeader({ user, stats, rank, profileCompletion, onEdit, onCopyProfileLink, isLoading }) {
  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded"></div>
          <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!user) return null;

  const picture = user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id || 'unknown'}`;

  return (
    <Card className="p-6 mb-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
        <div className="flex items-center gap-4">
          <img src={picture} alt={user.name||user.username||'User'} className="h-20 w-20 rounded-full object-cover" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name || 'Unnamed User'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username || 'unknown'}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{user.bio || 'Add a bio to make your profile stand out.'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Coins: {user.coins ?? 0}</Badge>
            <Badge variant="primary">Rank: #{rank || '-'}</Badge>
            <Badge variant="warning">Profile {profileCompletion ?? 0}%</Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {formatDate(user.updated_at)}</p>
        </div>

        <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
          <Button variant="secondary" size="sm" className="text-xs" onClick={onCopyProfileLink}>
            <Copy className="mr-1 h-3 w-3" />
            Copy Profile Link
          </Button>
          <Button variant="primary" size="sm" className="text-xs" onClick={onEdit}>
            <Edit3 className="mr-1 h-3 w-3" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {user.github && (
          <a href={user.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            <Github className="h-4 w-4" /> GitHub
          </a>
        )}
        {user.linkedin && (
          <a href={user.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        )}
      </div>
    </Card>
  );
}
