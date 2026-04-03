import React, { useState } from 'react';
import { Card } from '../ui/Card';

const getActivityColor = (count) => {
  if (count === 0) return 'bg-gray-100 dark:bg-dark-700';
  if (count === 1) return 'bg-green-200 dark:bg-green-900/40';
  if (count === 2) return 'bg-green-400 dark:bg-green-800/60';
  if (count === 3) return 'bg-green-600 dark:bg-green-700';
  return 'bg-green-800 dark:bg-green-600';
};

export default function ActivityGraph({ data = [] }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 mb-8">
        <p className="text-center text-gray-500 dark:text-gray-400">No activity data to chart.</p>
      </Card>
    );
  }

  const weeks = [];
  const activityMap = {};

  data.forEach((item) => {
    activityMap[item.date] = item.count;
  });

  const today = new Date();
  for (let i = 364; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const weekNum = Math.floor((364 - i) / 7);

    if (!weeks[weekNum]) weeks[weekNum] = [];
    weeks[weekNum].push({
      date: dateStr,
      count: activityMap[dateStr] || 0,
    });
  }

  const handleMouseEnter = (day, e) => {
    setHoveredDate(day);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 20 });
  };

  return (
    <Card className="p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Last 365 days activity</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{data.filter((d) => d.count > 0).length} active days</p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`w-3 h-3 rounded ${getActivityColor(day.count)} border border-gray-200 dark:border-dark-700`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hoveredDate && (
        <div
          className="fixed z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -110%)' }}
        >
          {hoveredDate.date}: {hoveredDate.count} submissions
        </div>
      )}
    </Card>
  );
}
