import React from 'react';
import { cn } from '../../utils/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: "bg-gray-100 text-gray-800 dark:bg-dark-700 dark:text-gray-200",
        primary: "bg-experr-100 text-experr-800 dark:bg-experr-900/30 dark:text-experr-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        outline: "border border-gray-200 text-gray-800 dark:border-dark-700 dark:text-gray-200 bg-transparent",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-experr-400 focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
