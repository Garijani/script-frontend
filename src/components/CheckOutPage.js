import React, { useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button
} from '@mui/material';
import QRScanner from './QRScanner';
import api from '../api';

export default function CheckOutPage() {
  const [scanned, setScanned] = useState([]);
  const handleScan = id =>
    setScanned(s => s.includes(id) ? s : [...s, id]);

  const confirm = async () => {
    const userId = window.prompt('Enter user ID to assign checkout to');
    if (!userId) return;
    await api.post('/transactions', {
      userId,
      items: scanned,
      type: 'checkout'
    });
    alert('Checked out!');
    setScanned([]);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>QR Code Check-Out</Typography>
      <Box mb={2} sx={{ maxWidth: 400 }}>
        <QRScanner onScan={handleScan} />
      </Box>
      <Typography mb={1}>Scanned Items:</Typography>
      <List dense>
        {scanned.map(id => (
          <ListItem key={id}>
            <ListItemText primary={id} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        disabled={!scanned.length}
        onClick={confirm}
      >
        Confirm Check-Out
      </Button>
    </Box>
  );
}
