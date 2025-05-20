import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar,
  Divider, Stack, Paper, InputAdornment
} from '@mui/material';
import api from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [projectRoles, setProjectRoles] = useState([]);
  const [passwordMatchError, setPasswordMatchError] = useState('');


  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const u = res.data;
      setUser(u);
      setName(u.name);
      setEmail(u.email);
      setPhoto(u.photo || '');
      setProjectRoles(u.projectPermissions || []);
    });
  }, []);

  useEffect(() => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordMatchError('New passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  }, [newPassword, confirmPassword]);
  

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); // base64 image
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await api.put('/users/me', {
        name,
        email,
        photo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (newPassword && newPassword === confirmPassword) {
        await api.put('/users/me/password', {
          currentPassword,
          newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert('Profile updated!');
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert('Something went wrong.');
    }
  };

  if (!user) return <Typography p={4}>Loading...</Typography>;
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="calc(100vh - 64px)"
      pt={6}
      px={2}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          boxShadow: (theme) =>
            `0 4px 12px ${theme.palette.mode === 'dark' ? '#00000040' : '#00000010'}`
        }}
      >
        <Typography variant="h5" mb={3} fontWeight="bold">
          🙋‍♂️ My Profile
        </Typography>
  
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar src={photo} alt={name} sx={{ width: 80, height: 80 }} />
          <label htmlFor="upload-photo">
            <input
              accept="image/*"
              id="upload-photo"
              type="file"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <Button variant="outlined" component="span">
              Upload Photo
            </Button>
          </label>
        </Stack>
  
        <TextField
          label="Full Name"
          variant="filled"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, borderRadius: 2, input: { borderRadius: 2 } }}
        />
  
        <TextField
          label="Email"
          variant="filled"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3, borderRadius: 2, input: { borderRadius: 2 } }}
        />
  
        <Divider sx={{ mb: 3 }} />
  
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 1 }}>
          🔐 Change Password (optional)
        </Typography>
  
        <TextField
          label="Current Password"
          type="password"
          variant="filled"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ mb: 2, borderRadius: 2, input: { borderRadius: 2 } }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="filled"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2, borderRadius: 2, input: { borderRadius: 2 } }}
        />
        <TextField
            label="Confirm New Password"
            type="password"
            variant="filled"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!passwordMatchError}
            helperText={passwordMatchError}
            sx={{ mb: 3, borderRadius: 2, input: { borderRadius: 2 } }}
        />

  
        <Divider sx={{ mb: 3 }} />
  
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'bold' }} gutterBottom>
          📜 Your Role
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{user.role?.name || 'User'}</Typography>
  
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'bold' }} gutterBottom>
          📁 Project Permissions
        </Typography>
        <Box sx={{ mb: 3 }}>
          {projectRoles.length === 0 ? (
            <Typography variant="body2">No assigned projects.</Typography>
          ) : (
            projectRoles.map((perm, i) => (
              <Typography key={i} variant="body2">
                • Project ID: {perm.projectId} — <strong>{perm.permission}</strong>
              </Typography>
            ))
          )}
        </Box>
  
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          sx={{
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            px: 4
          }}
        >
          💾 Save Changes
        </Button>
      </Paper>
    </Box>
  );
  
}
