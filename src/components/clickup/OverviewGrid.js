// src/components/clickup/OverviewGrid.js
import React from 'react';

const dummyFolders = [
  { id: '1', name: 'FTV WHISPER' },
  { id: '2', name: 'MBI WHISPER' },
  { id: '3', name: 'OUTSIDE FTV AND MBI' },
  { id: '4', name: 'TEST SHOOT WHISPER' }
];

export default function OverviewGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {dummyFolders.map(folder => (
        <div key={folder.id} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 shadow">
          <div className="text-lg font-semibold text-white">{folder.name}</div>
          <p className="text-gray-400 text-sm mt-1">Folder</p>
        </div>
      ))}
    </div>
  );
}
