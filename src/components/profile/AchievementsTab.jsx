import React from 'react';
import { Card } from '../ui/Card';

export default function AchievementsTab({ achievements = [] }) {
  if (!achievements || achievements.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">No achievements unlocked yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((ach) => (
        <Card key={ach.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{ach.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
            </div>
            <span className="text-xs font-bold text-experr-600 dark:text-experr-300">{ach.date}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
