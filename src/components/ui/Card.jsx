import React from 'react';
import { cn } from '../../utils/utils';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100 w-full",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }) {
    return (
        <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("p-6 pt-0", className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
            {children}
        </div>
    );
}
