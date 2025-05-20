// InviteUserModal.js
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, CircularProgress
} from '@mui/material';
import api from '../../api';

const InviteUserModal = ({ open, onClose, onInvited, workspaceId }) => {
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/users/roles');
      setRoles(res.data);
    } catch (err) {
      console.error('Failed to fetch roles', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRoles();
      setEmail('');
      setRoleName('');
    }
  }, [open]);

  const handleInvite = async () => {
    if (!email || !roleName) return alert('Please fill in all fields');
    try {
      setLoading(true);
      await api.post(`/workspaces/${workspaceId}/invite`, { email, roleName });
      setLoading(false);
      onInvited(); // refresh members
      onClose();   // close modal
    } catch (err) {
      console.error('Invite failed:', err);
      alert(err?.response?.data?.message || 'Error inviting user');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Invite a Member</DialogTitle>
      <DialogContent className="flex flex-col gap-4 mt-2">
        <TextField
          label="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Role"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
        >
          {roles.map((role) => (
            <MenuItem key={role.name} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleInvite}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Invite'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserModal;
