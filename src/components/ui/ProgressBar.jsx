import React from 'react';
import { cn } from '../../utils/utils';

export function ProgressBar({ value, max = 100, className, indicatorClassName }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700", className)}>
            <div
                className={cn("h-full bg-experr-600 transition-all duration-500 ease-in-out dark:bg-experr-500", indicatorClassName)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
