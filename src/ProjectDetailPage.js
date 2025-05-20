// frontend/src/ProjectDetailPage.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Divider, Card, CardContent, Button, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const API = process.env.REACT_APP_API;
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [script, setScript] = useState(null);
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0);

  useEffect(() => {
    // Fetch project details
    fetch(`${API}/projects`, { headers: { username: 'admin', password: 'admin' } })
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === projectId);
        setProject(found);
      });

    // Fetch scripts
    fetch(`${API}/scripts`, { headers: { username: 'admin', password: 'admin' } })
      .then(res => res.json())
      .then(data => {
        const linkedScript = data.find(s => s.title === projectId); // Adjust if you link by project ID differently
        setScript(linkedScript);
      });
  }, [API, projectId]);

  const selectedDraft = script?.drafts?.[selectedDraftIndex];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>📁 Project Details</Typography>
      <Divider sx={{ mb: 2 }} />

      {project ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">{project.title}</Typography>
            <Typography color="text.secondary">{project.description}</Typography>
            <Typography variant="body2" mt={1}>Category ID: {project.categoryId}</Typography>
            <Typography variant="body2">Created By: {project.createdBy}</Typography>
            <Typography variant="body2">Created At: {new Date(project.createdAt).toLocaleDateString()}</Typography>
            <Typography variant="body2">Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}</Typography>
          </CardContent>
        </Card>
      ) : <Typography>Loading project details...</Typography>}

      {script ? (
        <>
          <Typography variant="h6" mb={1}>🎬 Linked Script: {script.title}</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Choose Draft</InputLabel>
            <Select
              value={selectedDraftIndex}
              onChange={(e) => setSelectedDraftIndex(e.target.value)}
              label="Choose Draft"
            >
              {script.drafts.map((draft, idx) => (
                <MenuItem key={idx} value={idx}>
                  Draft {idx + 1} - {new Date(draft.uploadedAt).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Draft Preview Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Scene</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>INT/EXT</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Set</TableCell>
                <TableCell>Characters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedDraft?.breakdown?.slice(0, 10).map((scene, idx) => (
                <TableRow key={idx}>
                  <TableCell>{scene.sceneNumber}</TableCell>
                  <TableCell>{scene.location}</TableCell>
                  <TableCell>{scene.intExt}</TableCell>
                  <TableCell>{scene.time}</TableCell>
                  <TableCell>{scene.set}</TableCell>
                  <TableCell>{scene.characters}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Route to Full Breakdown */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate(`/script/${script._id}/draft/${selectedDraftIndex}/breakdown`)}
          >
            See Full Breakdown
          </Button>
        </>
      ) : (
        <Typography mt={2}>No script linked to this project yet.</Typography>
      )}
    </Box>
  );
}
