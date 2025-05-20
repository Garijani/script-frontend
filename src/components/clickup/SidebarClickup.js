import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function SidebarClickup() {
  const [workspaces, setWorkspaces] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/workspaces')
      .then(res => setWorkspaces(res.data))
      .catch(err => console.error('Failed to fetch workspaces:', err));
  }, []);

  const toggleExpand = (id) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 overflow-y-auto p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📁</span> Workspaces
        </h2>

        {workspaces.map(ws => (
          <div key={ws._id} className="mb-3">
            <button
              onClick={() => toggleExpand(ws._id)}
              className="w-full text-left font-medium hover:text-blue-400"
            >
              {ws.name}
            </button>
            {expanded === ws._id && (
              <WorkspaceSpaces workspaceId={ws._id} />
            )}
          </div>
        ))}

        <Link
          to="/clickup/workspaces"
          className={`block mt-4 text-sm ${
            isActive('/clickup/workspaces') ? 'text-blue-400' : 'text-purple-400'
          } hover:underline`}
        >
          ➕ Manage Workspaces
        </Link>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-800">
        <Outlet />
      </div>
    </div>
  );
}

function WorkspaceSpaces({ workspaceId }) {
  const [spaces, setSpaces] = useState([]);
  const location = useLocation();

  useEffect(() => {
    api.get(`/spaces/${workspaceId}`)
      .then(res => setSpaces(res.data))
      .catch(err => console.error('Failed to fetch spaces:', err));
  }, [workspaceId]);

  return (
    <div className="ml-3 mt-2 space-y-1">
      {spaces.map(space => (
        <Link
          key={space._id}
          to={`/clickup/workspace/${workspaceId}/space/${space._id}`}
          className={`block text-sm pl-2 border-l-2 ${
            location.pathname.includes(`/space/${space._id}`)
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-300 border-transparent hover:text-blue-300'
          }`}
        >
          ▸ {space.name}
        </Link>
      ))}
    </div>
  );
}
