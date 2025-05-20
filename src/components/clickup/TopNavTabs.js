// src/components/clickup/TopNavTabs.js

import React from 'react';

export default function TopNavTabs({ activeTab, onTabChange }) {
  const tabs = ['Overview', 'List', 'Board'];

  return (
    <div className="flex space-x-4 border-b border-gray-700 mb-4">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm font-medium rounded-t ${
            activeTab === tab
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
