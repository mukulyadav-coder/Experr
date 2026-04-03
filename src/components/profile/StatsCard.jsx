import React from 'react';
import { Card } from '../ui/Card';

export default function StatsCard({ icon: Icon, label, value, suffix, color, bgColor, darkBgColor, change, isPositive = true }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-3xl font-bold ${color || 'text-gray-900 dark:text-white'}`}>
            {value}{suffix || ''}
          </p>
        </div>
        {Icon && <Icon className="h-6 w-6 text-gray-400" />}
      </div>
      {change !== undefined && (
        <p className={`mt-2 text-xs ${isPositive ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
          {isPositive ? '+' : '-'}{Math.abs(change)}% from last week
        </p>
      )}
    </Card>
  );
}
