


// src/components/RequestPage.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import NewRequestModal from './NewRequestModal';
import RequestDetailModal from './RequestDetailModal'; // You'll create this

export default function RequestDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [userFilter, setUserFilter] = useState(false);
  const [withUserFilter, setWithUserFilter] = useState(false);
  const [returnedFilter, setReturnedFilter] = useState(false);



  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const navigate = useNavigate();

  const fetchRequests = () => {
    setLoading(true);
    api.get('/requests')
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/requests/${id}/approve`);
      fetchRequests();
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/requests/${id}/reject`);
      fetchRequests();
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Failed to reject request');
    }
  };

  const handleView = (req) => {
    setSelectedRequest(req);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Equipment Request Dashboard</Typography>
          <Stack direction="row" spacing={1} mt={2} mb={2} flexWrap="wrap">
            {['pending', 'approved', 'rejected'].map((status) => (
              <Chip
                key={status}
                label={status.toUpperCase()}
                clickable
                color={statusFilter === status ? 'primary' : 'default'}
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              />
            ))}

            <Chip
              label="My Requests"
              clickable
              color={userFilter ? 'primary' : 'default'}
              onClick={() => setUserFilter(!userFilter)}
            />

            <Chip
              label="With User"
              clickable
              color={withUserFilter ? 'primary' : 'default'}
              onClick={() => setWithUserFilter(!withUserFilter)}
            />

            <Chip
              label="Returned"
              clickable
              color={returnedFilter ? 'primary' : 'default'}
              onClick={() => setReturnedFilter(!returnedFilter)}
            />
          </Stack>

        <Button variant="contained" onClick={() => setModalOpen(true)}>
          New Request
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Requested By</TableCell>      
                <TableCell>Actions</TableCell>
         
              </TableRow>
            </TableHead>
            <TableBody>
                {requests
                  .filter((req) => {
                    const matchStatus = statusFilter ? req.status === statusFilter : true;
                    const matchUser = userFilter ? req.userId?._id === user?._id : true;
                    const matchWithUser = withUserFilter ? req.status?.toLowerCase().includes('with') : true;
                    const matchReturned = returnedFilter ? req.status?.toLowerCase().includes('returned') : true;

                    return matchStatus && matchUser && matchWithUser && matchReturned;
                  })


                .map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{req.purpose}</TableCell>
                    <TableCell>{req.destination}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell>{req.userId?.name || '-'}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleView(req)}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>

                      {['admin', 'inventory', 'approver'].includes(role) && req.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleApprove(req._id)}
                            size="small"
                            color="success"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(req._id)}
                            size="small"
                            color="error"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {['admin', 'inventory'].includes(role) && req.status === 'approved' && (
                        <Button
                          onClick={() => navigate(`/scanner/checkout/${req._id}`)}
                          size="small"
                          variant="contained"
                          sx={{ ml: 1 }}
                        >
                          Begin Checkout
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      )}

      <NewRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchRequests}
      />

        <RequestDetailModal
            open={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
            request={selectedRequest}
            onSuccess={fetchRequests} // ✅ Pass to refresh table after approve/reject
        />

    </Box>
  );
}
