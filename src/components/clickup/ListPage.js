import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

export default function ListPage() {
  const { listId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [listId]);

  const fetchTasks = () => {
    api.get(`/tasks/${listId}`)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Failed to fetch tasks:', err));
  };

  const handleCreate = async () => {
    if (!newTaskName.trim()) return;
    try {
      const res = await api.post('/tasks', {
        name: newTaskName.trim(),
        listId,
      });
      setTasks([...tasks, res.data]);
      setNewTaskName('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">✅ Tasks in List</h1>

      <div className="space-y-3 mb-6">
        {tasks.map(task => (
          <div
            key={task._id}
            className="p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="font-semibold">{task.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow max-w-md">
        <h2 className="text-lg font-medium mb-2">Create New Task</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
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
