// frontend/src/ModalView.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Box
} from '@mui/material';

const ModalView = ({ open, onClose, scriptDetails }) => {
  const navigate = useNavigate();

  if (!scriptDetails) return null;

  // Helper to remove file extension
  const removeExtension = (filename) => filename.replace(/\.[^/.]+$/, "");
  const titleWithoutExt = removeExtension(scriptDetails.title);
  const latestDraftLabel = scriptDetails.drafts && scriptDetails.drafts.length > 0
    ? `Draft ${scriptDetails.drafts.length}`
    : '-';

  // Update: Redirect to the full breakdown page using the /breakdown route
  const handleViewFullBreakdown = () => {
    onClose(); // close the current modal
    navigate(`/breakdown/${scriptDetails._id}`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{titleWithoutExt} - {latestDraftLabel}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Updated At:</strong> {scriptDetails.updatedAt ? new Date(scriptDetails.updatedAt).toLocaleString() : '-'}
          </Typography>
          <Typography variant="body1">
            <strong>Uploaded At:</strong> {scriptDetails.uploadedAt ? new Date(scriptDetails.uploadedAt).toLocaleString() : '-'}
          </Typography>
          <Typography variant="body1">
            <strong>Shooting Date:</strong> {scriptDetails.shootingDate ? new Date(scriptDetails.shootingDate).toLocaleDateString() : '-'}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>Breakdown</Typography>
        {scriptDetails.drafts && scriptDetails.drafts.length > 0 && scriptDetails.drafts.map((draft, index) => (
          <Box key={index} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Draft {index + 1} - {draft.originalName}
            </Typography>
            {draft.breakdown && draft.breakdown.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Scene</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>INT/EXT</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Set</TableCell>
                      <TableCell>Characters</TableCell>
                      <TableCell>Action Summary</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {draft.breakdown.map((scene, i) => (
                      <TableRow key={i}>
                        <TableCell>{scene.sceneNumber}</TableCell>
                        <TableCell>{scene.location}</TableCell>
                        <TableCell>{scene.intExt}</TableCell>
                        <TableCell>{scene.time}</TableCell>
                        <TableCell>{scene.set}</TableCell>
                        <TableCell>{scene.characters}</TableCell>
                        <TableCell>{scene.actionSummary}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No breakdown available.</Typography>
            )}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
        <Button variant="contained" color="primary" onClick={handleViewFullBreakdown}>
          View Full Breakdown
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalView;
