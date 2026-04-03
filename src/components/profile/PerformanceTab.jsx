import React from 'react';
import { Card } from '../ui/Card';

export default function PerformanceTab({ stats, monthlyData = [] }) {
  if (!stats) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">Performance data not available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Submissions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Accepted</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.acceptedSubmissions}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.accuracy}%</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-end gap-2 h-44">
          {monthlyData.map((item) => (
            <div key={item.month} className="flex flex-col items-center gap-1">
              <div className="relative h-32 w-4 bg-slate-200 dark:bg-dark-700 rounded-t">
                <div className="absolute bottom-0 left-0 right-0 bg-experr-500 rounded-t" style={{ height: `${item.submissions}%` }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.month}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
