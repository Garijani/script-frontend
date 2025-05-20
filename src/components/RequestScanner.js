import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Chip, Alert, CircularProgress } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../api';

export default function RequestScanner() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [status, setStatus] = useState(null);
  const scannerRef = useRef(null);

  // Fetch full request data
  useEffect(() => {
    api.get(`/requests/${requestId}/full`)
      .then(res => setRequest(res.data))
      .catch(err => console.error('Failed to load request:', err));
  }, [requestId]);

  // Setup scanner once request is loaded
  useEffect(() => {
    if (!request) return;

    const scanner = new Html5QrcodeScanner(
      'qr-checkout-scanner',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (scannedItems.includes(decodedText)) {
          setStatus({ type: 'info', message: 'Already scanned' });
          return;
        }

        try {
          const res = await api.patch(`/requests/${requestId}/scan`, {
            itemId: decodedText
          });

          const { matched, alreadyCheckedOut, item } = res.data;

          if (matched) {
            setScannedItems(prev => [...prev, decodedText]);
            setStatus({
              type: alreadyCheckedOut ? 'warning' : 'success',
              message: alreadyCheckedOut
                ? `Already checked out: ${item.fields?.['Item Name'] || item._id}`
                : `✅ Checked out: ${item.fields?.['Item Name'] || item._id}`
            });
          } else {
            setStatus({
              type: 'error',
              message: '⚠️ Item is not in this request'
            });
          }
        } catch (err) {
          console.error(err);
          setStatus({
            type: 'error',
            message: err.response?.data?.message || 'Scan failed'
          });
        }
      },
      (err) => console.warn('QR Scan error', err)
    );

    scannerRef.current = scanner;

    return () => {
      scannerRef.current?.clear();
    };
  }, [request]);

  if (!request) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Scanning Items for Request by {request.userId?.name || 'User'}
      </Typography>
      <Typography>
        Total Items: {request.items.length}
      </Typography>

      <div id="qr-checkout-scanner" style={{ width: '100%', marginTop: 16 }}></div>

      {status && (
        <Alert severity={status.type} sx={{ mt: 2 }}>
          {status.message}
        </Alert>
      )}

      <Box mt={2}>
        <Typography variant="subtitle1">✅ Scanned Items:</Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {scannedItems.map((id, index) => (
            <Chip key={index} label={id} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
