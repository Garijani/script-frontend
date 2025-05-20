//frontend/src/components/Login.js


import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Snackbar, useTheme, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme(); // ✅ detect dark/light mode
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log('User logged in:', response.data.user);
      navigate('/');
    } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
        setError(message);
        setOpenSnackbar(true);
      }

  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default',
      }}

      
    >
      
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          width: 350,
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Login
        </Typography>
  
        <TextField
          fullWidth
          margin="normal"
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
  
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#90caf9' }}
          onClick={handleLogin}
        >
          LOGIN
        </Button>
  
        {/* ✅ Register Link */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{' '}
          <Button variant="text" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Typography>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }} onClose={() => setOpenSnackbar(false)}>
          {error}
        </Alert>
      </Snackbar>

    </Box>
  );
  
}
