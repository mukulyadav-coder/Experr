import React, { useState, createContext, useContext } from 'react';
import { cn } from '../../utils/utils';

const TabsContext = createContext();

export function Tabs({ value, onValueChange, className, children }) {
    const [activeTab, setActiveTab] = useState(value);

    const handleValueChange = (newValue) => {
        setActiveTab(newValue);
        if (onValueChange) onValueChange(newValue);
    };

    return (
        <TabsContext.Provider value={{ activeTab, onValueChange: handleValueChange }}>
            <div className={cn("", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, children }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-1", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, className, children }) {
    const { activeTab, onValueChange } = useContext(TabsContext);

    return (
        <button
            onClick={() => onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
                activeTab === value
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7c3aed] after:rounded-full"
                    : "hover:bg-[#7c3aed] hover:text-white text-muted-foreground rounded-md",
                className
            )}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, className, children }) {
    const { activeTab } = useContext(TabsContext);

    if (activeTab !== value) return null;

    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
}
