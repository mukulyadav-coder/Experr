import React, { useState } from 'react';
import { cn } from '../../utils/utils';

export function Tabs({ tabs, defaultTab, onChange, className }) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (onChange) onChange(tabId);
    };

    return (
        <div className={cn("flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-dark-800", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                        "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        activeTab === tab.id
                            ? "bg-white text-gray-900 shadow-sm dark:bg-dark-700 dark:text-white"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
