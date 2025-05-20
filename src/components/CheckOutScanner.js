import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Typography, Alert, Button } from '@mui/material';
import api from '../api';

export default function CheckOutScanner() {
  const [status, setStatus] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "checkout-qr-scanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText, decodedResult) => {
        scanner.clear();
        try {
          const res = await api.patch(`/inventory/${decodedText}/status`, { action: 'checkout' });
          setStatus({
            type: 'success',
            message: `✅ Checked out: ${res.data.item.fields?.['Item Name'] || res.data.item._id}`
          });
        } catch (err) {
          setStatus({
            type: 'error',
            message: err.response?.data?.message || 'Checkout failed'
          });
        }
      },
      (err) => {
        console.warn('QR Scan error:', err);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scannerRef.current?.clear();
    };
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>📦 QR Checkout Scanner</Typography>
      <div id="checkout-qr-scanner" style={{ width: '100%' }}></div>
      {status && <Alert severity={status.type} sx={{ mt: 2 }}>{status.message}</Alert>}
      <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Scan Another</Button>
    </Box>
  );
}
