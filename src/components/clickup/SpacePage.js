import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

export default function SpacePage() {
  const { workspaceId, spaceId } = useParams();
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchFolders();
  }, [spaceId]);

  const fetchFolders = () => {
    api.get(`/folders/${spaceId}`)
      .then(res => setFolders(res.data))
      .catch(err => console.error('Failed to fetch folders:', err));
  };

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await api.post(`/folders`, {
        name: newFolderName.trim(),
        spaceId
      });
      setFolders([...folders, res.data]);
      setNewFolderName('');
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📂 Folders in Space</h1>

      <div className="space-y-3 mb-6">
        {folders.map(folder => (
          <div
            key={folder._id}
            className="p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="font-semibold">{folder.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow max-w-md">
        <h2 className="text-lg font-medium mb-2">Create New Folder</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  );
}
