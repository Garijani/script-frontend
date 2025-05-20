//src/AddCategoryModal.js


import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';

export default function AddCategoryModal({ open, onClose, onCreated, existing }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const API = process.env.REACT_APP_API;

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || '',
        description: existing.description || ''
      });
    } else {
      setForm({ name: '', description: '' });
    }
  }, [existing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = existing
      ? `${API}/categories/${existing._id}`
      : `${API}/categories`;

    const method = existing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        username: 'admin',
        password: 'admin'
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      onCreated();
      onClose();
    } else {
      alert('Failed to save category');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{existing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            name="name"
            label="Category Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {existing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
