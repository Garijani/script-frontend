// src/AddProjectModal.js

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';

export default function AddProjectModal({ open, onClose, onCreated, categoryId, categoryName }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shootingDate: ''
  });

  const API = process.env.REACT_APP_API;

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Project title is required.');
      return;
    }

    fetch(`${API}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: 'admin',
        password: 'admin'
      },
      body: JSON.stringify({
        ...formData,
        categoryId,
        lastUpdated: new Date().toISOString()
      })
    })
      .then(res => res.json())
      .then(() => {
        onCreated();
        onClose();
        setFormData({ title: '', description: '', shootingDate: '' });
      })
      .catch(err => console.error('Error creating project:', err));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Category"
            value={categoryName || ''}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Shooting Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.shootingDate}
            onChange={(e) => setFormData({ ...formData, shootingDate: e.target.value })}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
