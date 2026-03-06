import React from 'react';
import { cn } from '../../utils/utils';

export const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-experr-500 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-experr-600 text-white hover:bg-experr-700 shadow-sm",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 dark:bg-dark-800 dark:text-gray-100 dark:border-dark-700 dark:hover:bg-dark-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-dark-800 dark:hover:text-gray-100 text-gray-600 dark:text-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";
