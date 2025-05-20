import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, useTheme, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/register', { name, email, password });
      console.log('Registered:', response.data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          width: 380,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Registration successful! Redirecting...</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button variant="text" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
