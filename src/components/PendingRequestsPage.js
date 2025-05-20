import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, CircularProgress, Stack
} from '@mui/material';
import api from '../api';

export default function PendingRequestsPage() {
  const [reqs, setReqs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests?status=pending')
       .then(({data}) => setReqs(data))
       .finally(() => setLoading(false));
  }, []);

  const action = (id, verb) => {
    api.patch(`/requests/${id}/${verb}`)
       .then(() => setReqs(r => r.filter(x => x._id !== id)));
  };

  if (loading) return <CircularProgress />;
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Pending Requests</Typography>
      {reqs.length === 0
        ? <Typography>No pending requests.</Typography>
        : (
          <List>
            {reqs.map(r => (
              <ListItem key={r._id} divider>
                <ListItemText
                  primary={`By ${r.userId.username}`}
                  secondary={`Items: ${r.items.map(i => Object.values(i.fields)[0]||i._id).join(', ')}`}
                />
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="contained" onClick={() => action(r._id, 'approve')}>Approve</Button>
                  <Button size="small" variant="outlined" onClick={() => action(r._id, 'reject')}>Reject</Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        )
      }
    </Box>
  );
}
