//src/AddModuleModal.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

export default function AddModuleModal({ open, onClose, onCreated, existing }) {
  const [name, setName] = useState('');
  const API = process.env.REACT_APP_API;

  useEffect(() => {
    setName(existing?.name || '');
  }, [existing]);

  const generateRoute = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const handleSubmit = () => {
    const payload = {
      name,
      route: generateRoute(name)
    };

    const method = existing ? 'PUT' : 'POST';
    const url = existing
      ? `${API}/modules/${existing._id}`
      : `${API}/modules`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        username: 'admin',
        password: 'admin'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save module');
        return res.json();
      })
      .then(() => {
        onCreated();
        onClose();
        setName('');
      })
      .catch(err => alert(err.message));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existing ? 'Edit Module' : 'Add New Module'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Module Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        {/* Route is auto-generated and hidden from user */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {existing ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
