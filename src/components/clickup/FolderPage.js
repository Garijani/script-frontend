import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

export default function FolderPage() {
  const { folderId } = useParams();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchLists();
  }, [folderId]);

  const fetchLists = () => {
    api.get(`/lists/${folderId}`)
      .then(res => setLists(res.data))
      .catch(err => console.error('Failed to fetch lists:', err));
  };

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    try {
      const res = await api.post(`/lists`, {
        name: newListName.trim(),
        folderId
      });
      setLists([...lists, res.data]);
      setNewListName('');
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📝 Lists in Folder</h1>

      <div className="space-y-3 mb-6">
        {lists.map(list => (
          <div
            key={list._id}
            className="p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="font-semibold">{list.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow max-w-md">
        <h2 className="text-lg font-medium mb-2">Create New List</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="List name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
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
