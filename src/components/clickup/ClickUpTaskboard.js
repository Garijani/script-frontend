import React from 'react';

const statuses = [
  'TO DO',
  'ON HOLD',
  'ON GOING',
  'FEEDBACK/REVISI',
  'ONLINE SUBMISSION',
  'READY FOR GRADING',
  'POST COMPLETED',
];

const mockTasks = [
  { id: 'EGE-COMP-A001_0001', title: 'Mock Task 1' },
  { id: 'EGE-COMP-A001_0002', title: 'Mock Task 2' },
];

export default function ClickupTaskBoard() {
  return (
    <div className="h-[calc(100vh-80px)] overflow-x-auto overflow-y-hidden bg-[#121212] text-white p-4">
      <div className="flex gap-4 min-w-max">
        {statuses.map((status) => (
          <div
            key={status}
            className="bg-[#1f1f1f] rounded-xl w-80 flex-shrink-0 flex flex-col max-h-full"
          >
            <div className="p-3 border-b border-gray-700 font-semibold text-sm uppercase tracking-wide">
              {status}
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-3">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#2a2a2a] p-3 rounded-lg shadow hover:bg-[#333] transition"
                >
                  <div className="font-bold text-sm">{task.id}</div>
                  <div className="text-xs text-gray-400">{task.title}</div>
                </div>
              ))}
              <button className="w-full mt-2 text-left text-blue-400 text-xs hover:underline">
                ➕ Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
