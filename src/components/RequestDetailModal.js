// src/components/RequestDetailModal.js

import React, { useEffect, useState, useRef, useCallback  } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Divider, Snackbar, Alert
} from '@mui/material';
import QRScanner from './QRScanner';
import api from '../api';

export default function RequestDetailModal({
  open, onClose, request, onSuccess
}) {
  // ─── State & Refs ───────────────────────────────────────────
  const [fullRequest, setFullRequest]     = useState(null);
  const [loading, setLoading]             = useState(true);
  const [snackbar, setSnackbar]           = useState({ open:false, message:'', severity:'success' });
  const [scanning, setScanning]           = useState(false);
  const [mode, setMode]                   = useState('checkout');
  const [scannedIds, setScannedIds]       = useState([]);           // track which IDs have been scanned
  const [unexpectedItems, setUnexpectedItems] = useState([]);
  const scannedUnexpectedSet = useRef(new Set());
  const qrRef                = useRef();
  const beepRef = useRef(null);
  // const beepRef              = useRef(typeof Audio !== 'undefined' ? new Audio('/beep.mp3') : null);

  const currentUser      = JSON.parse(localStorage.getItem('user')) || {};
  const canApprove       = currentUser.permissions?.includes('approveRequest');
  const canScan          = currentUser.permissions?.includes('scanItem');
  const canHandleHandover = canScan || canApprove;

  // ─── Helpers ─────────────────────────────────────────────────
  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open:true, message, severity });

  // ─── Load / Refresh Request ────────────────────────────────────
  const loadRequest = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/requests/${request._id}/full`);
      setFullRequest(data);

      // seed any parents already checked-out or returned
      const parentsScanned = data.items
        .filter(e => e.checkedOut || e.returned)
        .map(e => e.item._id.toString());
      setScannedIds(parentsScanned);
    } catch {
      showSnackbar('Failed to load request','error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (request?._id) loadRequest();
  }, [request]);

  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      beepRef.current = new Audio('/beep.mp3');
      // Preload the audio to avoid delays on first scan
      beepRef.current.load();
    }
  }, []);

  // ─── Action Handlers ──────────────────────────────────────────
  const handleApprove = async () => {
    try {
      await api.patch(`/requests/${fullRequest._id}/approve`);
      showSnackbar('Request approved');
      onSuccess?.();
      onClose();
    } catch {
      showSnackbar('Failed to approve request','error');
    }
  };

  const handleReject = async () => {
    try {
      await api.patch(`/requests/${fullRequest._id}/reject`);
      showSnackbar('Request rejected');
      onSuccess?.();
      onClose();
    } catch {
      showSnackbar('Failed to reject request','error');
    }
  };

  const handleConfirmHandover = async () => {
    try {
      await api.patch(`/requests/${fullRequest._id}/confirm-handover`);
      showSnackbar('Handover confirmed');
      await loadRequest();
    } catch {
      showSnackbar('Failed to confirm handover','error');
    }
  };

  const handleConfirmReturn = async () => {
    try {
      await api.patch(`/requests/${fullRequest._id}/confirm-return`);
      showSnackbar('Return confirmed');
      await loadRequest();
    } catch {
      showSnackbar('Failed to confirm return','error');
    }
  };

  const handleMarkFound = async (itemId) => {
    try {
      await api.patch(
        `/requests/${fullRequest._id}/mark-returned`,
        { itemId }
      );
      showSnackbar('Item marked as returned');
      await loadRequest();
    } catch {
      showSnackbar('Failed to mark as returned','error');
    }
  };
  

  const handleScan = async (scannedId) => {
  beepRef.current?.play().catch(() => {});
  if (!fullRequest) {
    scanning && qrRef.current?.start();
    return;
  }

  const itemEntry = fullRequest.items.find(entry => entry.item._id === scannedId);

  const alreadyCheckedOut = itemEntry?.checkedOut && mode === 'checkout';
  const alreadyReturned = itemEntry?.returned && mode === 'checkin';

  // 🛑 Skip if already processed
  if ((alreadyCheckedOut || alreadyReturned) || scannedUnexpectedSet.current.has(scannedId)) {
    scanning && qrRef.current?.start();
    return;
  }

  try {
    const res = await api.patch(
      `/requests/${fullRequest._id}/scan`,
      { itemId: scannedId, mode }
    );

    // ✅ Requested item
    if (res.data.matched) {
      const itemName = res.data.item.fields?.['Item Name'] || 'Item';

      // Update status and UI
      showSnackbar(`✅ ${itemName} ${mode === 'checkout' ? 'checked out' : 'returned'}`);
      setScannedIds(prev => [...prev, scannedId]);
      setFullRequest(prev => ({
        ...prev,
        items: prev.items.map(entry => {
          if (entry.item._id === scannedId || entry.item._id === res.data.item._id) {
            return {
              ...entry,
              checkedOut: mode === 'checkout' ? true : entry.checkedOut,
              returned: mode === 'checkin' ? true : entry.returned
            };
          }
          return entry;
        })
      }));
    }

    // ⚠️ Unexpected item
    else {
      const unexpectedItem = res.data.item;
      if (unexpectedItem && !scannedUnexpectedSet.current.has(unexpectedItem._id)) {
        scannedUnexpectedSet.current.add(unexpectedItem._id);
        setUnexpectedItems(prev => [...prev, unexpectedItem]);
        showSnackbar(res.data.message || '⚠️ Unexpected item', 'warning');
      }
    }
  } catch (err) {
    console.error('Scan failed:', err);
    showSnackbar('❌ Scan failed', 'error');
  }

  scanning && qrRef.current?.start();
};


  const startScanner = () => { qrRef.current?.start();   setScanning(true);  };
  const stopScanner  = () => { qrRef.current?.stop();    setScanning(false); };

  // ─── Render ───────────────────────────────────────────────────
  if (!open || !request) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent dividers>
          {loading || !fullRequest ? (
            <Typography>Loading…</Typography>
          ) : (
            <>
              {/* Header */}
              <Box mb={2}>
                <Typography><strong>Purpose:</strong> {fullRequest.purpose}</Typography>
                <Typography><strong>Destination:</strong> {fullRequest.destination}</Typography>
                <Typography><strong>Date Used:</strong> {new Date(fullRequest.dateUsed).toLocaleDateString()}</Typography>
                <Typography><strong>Return Date:</strong> {new Date(fullRequest.returnDate).toLocaleDateString()}</Typography>
                <Typography><strong>Status:</strong> {fullRequest.status}</Typography>
                <Typography><strong>Requested By:</strong> {fullRequest.userId.name}</Typography>
              </Box>

              <Divider sx={{ my:2 }} />

              {/* Items + Accessories */}
            <Typography variant="h6">Items Requested:</Typography>
            <Box display="flex" flexDirection="column" gap={2} my={1}>
              {fullRequest.items
                .filter(entry => !entry.item.parentItem) // Only parent items
                .map(entry => {
                  const { checkedOut, returned, missing, quantity, item } = entry;

                  // Determine color and variant for parent item
                  let color = 'default';
                  let variant = 'filled';
                  if (missing) {
                    color = 'error';
                    variant = 'outlined';
                  } else if (returned) {
                    color = 'info';
                    variant = 'outlined';
                  } else if (checkedOut) {
                    color = 'success';
                    variant = 'outlined';
                  }

                  // Find accessories linked to this parent
                  const accessories = fullRequest.items.filter(
                    accEntry => accEntry.item.parentItem === item._id
                  );

                  return (
                    <Box key={item._id} mb={1}>
                      {/* Parent Item Chip */}
                      <Chip
                        label={`${item.fields['Item Name']} (qty ${quantity})`}
                        color={color}
                        variant={variant}
                        sx={{ fontWeight: 500 }}
                      />

                      {/* Accessories Chips */}
                      {accessories.length > 0 && (
                        <Box ml={4} mt={1} display="flex" flexWrap="wrap" gap={1}>
                          {accessories.map(accEntry => {
                            const aid = accEntry.item._id.toString();

                            // Determine color and variant for accessory
                            let accColor = 'default';
                            let accVariant = 'filled';
                            if (accEntry.missing) {
                              accColor = 'error';
                              accVariant = 'outlined';
                            } else if (accEntry.returned) {
                              accColor = 'info';
                              accVariant = 'outlined';
                            } else if (accEntry.checkedOut) {
                              accColor = 'success';
                              accVariant = 'outlined';
                            }

                            return (
                              <Chip
                                key={aid}
                                label={`${accEntry.item.fields['Item Name']} (qty 1)`}
                                color={accColor}
                                variant={accVariant}
                                size="small"
                                disabled={accEntry.missing}
                                onClick={accEntry.missing ? () => handleMarkFound(aid) : undefined}
                              />
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  );
                })}
            </Box>



              {/* Unexpected */}
              {unexpectedItems.length > 0 && (
                <>
                  <Divider sx={{ my:2 }} />
                  <Typography variant="h6" color="warning.main">Unexpected Items:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} my={1}>
                    {unexpectedItems.map(u => (
                      <Chip
                        key={u._id}
                        label={u.fields?.['Item Name'] || u.name || u._id}

                        color="warning"
                        onDelete={() => setUnexpectedItems(prev => prev.filter(x => x._id !== u._id))}
                      />
                    ))}
                  </Box>
                </>
              )}

              {/* Scanner */}
              {canScan && (
                <Box mt={3}>
                  <Divider sx={{ my:2 }} />
                  <Typography variant="subtitle1">Scan Items</Typography>
                  <Box display="flex" gap={1} mb={1}>
                    <Button variant={mode==='checkout'?'contained':'outlined'} onClick={()=>setMode('checkout')}>Check Out</Button>
                    <Button variant={mode==='checkin' ?'contained':'outlined'} onClick={()=>setMode('checkin')}>Check In</Button>
                    {!scanning
                      ? <Button variant="contained" onClick={startScanner}>Start Scan</Button>
                      : <Button variant="outlined" color="warning" onClick={stopScanner}>Stop Scan</Button>
                    }
                  </Box>
                  <QRScanner ref={qrRef} onScan={handleScan}/>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
  <Button onClick={onClose}>Close</Button>

  {/** Pending → Approve / Reject */}
  {canApprove && fullRequest?.status === 'pending' && (
    <>
      <Button
        color="success"
        variant="contained"
        onClick={handleApprove}
      >
        Approve
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={handleReject}
      >
        Reject
      </Button>
    </>
  )}

  {/** Approved but not yet handed over → Confirm Handover */}
  {canHandleHandover && fullRequest?.status === 'approved' && !fullRequest?.handoverConfirmed && (
    <Button
      color="info"
      variant="contained"
      onClick={handleConfirmHandover}
    >
      Confirm Handover
    </Button>
  )}

  {/** Handed over but not yet returned → Confirm Returning */}
  {canHandleHandover && fullRequest?.handoverConfirmed && !fullRequest?.returnConfirmed && (
    <Button
      color="secondary"
      variant="contained"
      onClick={handleConfirmReturn}
    >
      Confirm Returning
    </Button>
  )}
</DialogActions>


      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={()=>setSnackbar(s=>({...s,open:false}))}
        anchorOrigin={{vertical:'bottom',horizontal:'center'}}
      >
        <Alert severity={snackbar.severity} onClose={()=>setSnackbar(s=>({...s,open:false}))} sx={{width:'100%'}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
