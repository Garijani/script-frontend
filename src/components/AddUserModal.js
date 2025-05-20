import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, Box
} from '@mui/material';
import api from '../api';

export default function AddUserModal({ open, onClose, onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (open) {
      api.get('/users/roles', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setRoles(res.data));
    }
  }, [open]);

  const handleSubmit = async () => {
    await api.post('/auth/register', {
      name,
      email,
      password,
      role
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    onUserAdded(); // refresh parent list
    onClose();
    setName('');
    setEmail('');
    setPassword('');
    setRole('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"

    PaperProps={{
        sx: { borderRadius: 4 } // 👈 3 = 24px radius (use 2 for 16px, 1 for 8px)
      }}
    >
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Select value={role} onChange={e => setRole(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>Select Role</MenuItem>
            {roles.map(r => (
              <MenuItem key={r._id} value={r.name}>{r.name}</MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!email || !password || !role}>Add User</Button>
      </DialogActions>
    </Dialog>
  );
}
