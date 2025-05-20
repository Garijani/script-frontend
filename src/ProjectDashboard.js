// //src/ProjectDashboard.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Chip,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  UploadFile as UploadFileIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import api from './api'; // Import api.js

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createScriptLoading, setCreateScriptLoading] = useState(false);
  const [createScriptError, setCreateScriptError] = useState(null);
  const [openTitleDialog, setOpenTitleDialog] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptShootingDate, setNewScriptShootingDate] = useState(null);
  const [newScriptDescription, setNewScriptDescription] = useState('');
  const [editScript, setEditScript] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!projectId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [projRes, catsRes, scriptsRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get('/categories'),
          api.get(`/scripts?projectId=${projectId}`),
        ]);

        setProject(projRes.data);
        setScripts(scriptsRes.data);

        const matchedCat = catsRes.data.find(c => c._id === projRes.data.categoryId);
        setCategoryName(matchedCat ? matchedCat.name : '');
      } catch (err) {
        console.error('Failed to load project dashboard:', err);
        setSnackbarMessage('Failed to load project dashboard.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [projectId]);

  const removeExtension = (filename) => filename.replace(/\.[^/.]+$/, '');
  const formatDate = (iso) =>
    iso ? format(new Date(iso), 'MMM d, yyyy') : 'TBD';

  const refetchScripts = async () => {
    try {
      const scriptsRes = await api.get(`/scripts?projectId=${projectId}`);
      setScripts(scriptsRes.data);
    } catch (err) {
      console.error('Failed to refetch scripts:', err);
      setSnackbarMessage('Failed to refresh scripts list.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenTitleDialog = () => {
    if (editScript) {
      setNewScriptTitle(editScript.title);
      setNewScriptShootingDate(editScript.shootingDate ? parseISO(editScript.shootingDate) : null);
      setNewScriptDescription(editScript.description || '');
    } else {
      setNewScriptTitle(`${project?.title || 'Script'} - Script ${scripts.length + 1}`);
      setNewScriptShootingDate(null);
      setNewScriptDescription('');
    }
    setOpenTitleDialog(true);
  };

  const handleCloseTitleDialog = () => {
    setOpenTitleDialog(false);
    setCreateScriptError(null);
    setNewScriptTitle('');
    setNewScriptShootingDate(null);
    setNewScriptDescription('');
    setEditScript(null);
  };

  const handleCreateScript = async () => {
    if (!newScriptTitle.trim()) {
      setCreateScriptError('Script title is required.');
      return;
    }

    setCreateScriptLoading(true);
    setCreateScriptError(null);
    try {
      const response = await api.post('/scripts', {
        title: newScriptTitle.trim(),
        projectId: projectId,
        drafts: [],
        shootingDate: newScriptShootingDate ? newScriptShootingDate.toISOString() : undefined,
        description: newScriptDescription,
      });

      await refetchScripts();
      setOpenTitleDialog(false);
      setSnackbarMessage('Script created! Upload a file to start the breakdown.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate(`/breakdown/${response.data._id}`);
    } catch (err) {
      console.error('Failed to create script:', err);
      setCreateScriptError('Failed to create script. Please try again.');
    } finally {
      setCreateScriptLoading(false);
    }
  };

  const handleEdit = (script) => {
    setEditScript(script);
    handleOpenTitleDialog();
  };

  const handleUpdateScript = async () => {
    if (!newScriptTitle.trim()) {
      setCreateScriptError('Script title is required.');
      return;
    }

    setCreateScriptLoading(true);
    setCreateScriptError(null);
    try {
      await api.put(`/scripts/${editScript._id}`, {
        title: newScriptTitle.trim(),
        shootingDate: newScriptShootingDate ? newScriptShootingDate.toISOString() : null,
        description: newScriptDescription,
      });

      await refetchScripts();
      setOpenTitleDialog(false);
      setEditScript(null);
      setNewScriptTitle('');
      setNewScriptShootingDate(null);
      setNewScriptDescription('');
      setSnackbarMessage('Script updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to update script:', err);
      setCreateScriptError('Failed to update script. Please try again.');
    } finally {
      setCreateScriptLoading(false);
    }
  };

  const handleDelete = (script) => {
    setScriptToDelete(script);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setCreateScriptLoading(true);
    try {
      await api.delete(`/scripts/${scriptToDelete._id}`);

      await refetchScripts();
      setOpenDeleteDialog(false);
      setScriptToDelete(null);
      setSnackbarMessage('Script deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to delete script:', err);
      setSnackbarMessage('Failed to delete script.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCreateScriptLoading(false);
    }
  };

  const filteredScripts = useMemo(() => {
    return scripts.filter(s =>
      removeExtension(s.title).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, scripts]);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading project details...</Typography>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6">Project not found.</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ px: 0, pt: 0, pb: 4, maxWidth: '100%' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => navigate('/')}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => navigate(`/category/${project.categoryId}`)}
          >
            {categoryName}
          </Link>
          <Typography color="text.primary">{project.title}</Typography>
        </Breadcrumbs>

        {/* Project Info */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {project.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {project.description || 'No description provided.'}
          </Typography>
          <Typography variant="body2" color="primary">
            Category: {categoryName}
          </Typography>
        </Paper>

        {/* Scripts Header */}
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">📜 Scripts</Typography>
          <Box display="flex" alignItems="center">
            {filteredScripts.length > 0 && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenTitleDialog}
                sx={{ mr: 2 }}
              >
                New Script
              </Button>
            )}
            <TextField
              size="small"
              placeholder="Search scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Scripts List */}
        {filteredScripts.length === 0 ? (
          <Card sx={{ maxWidth: 400, margin: 'auto', mt: 2, textAlign: 'center' }}>
            <CardContent>
              <UploadFileIcon sx={{ fontSize: 60, color: 'grey.500', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Scripts Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get started by uploading a script and generating a breakdown.
              </Typography>
              {createScriptError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {createScriptError}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenTitleDialog}
                disabled={createScriptLoading}
              >
                {createScriptLoading ? <CircularProgress size={24} /> : 'Create First Script'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredScripts.map((script) => (
              <Grid item xs={12} sm={6} md={4} key={script._id}>
                <Card>
                  <CardHeader
                    avatar={<Avatar>{removeExtension(script.title)[0]}</Avatar>}
                    title={removeExtension(script.title)}
                    subheader={formatDate(script.shootingDate)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {script.description || 'No description available.'}
                    </Typography>
                    <Chip
                      label={script.drafts?.length || 0 + ' Drafts'}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions disableSpacing>
                    <Tooltip title="View Breakdown">
                      <IconButton
                        onClick={() => navigate(`/breakdown/${script._id}`)}
                        aria-label="view"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(script)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(script)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create/Edit Script Dialog */}
        <Dialog open={openTitleDialog} onClose={handleCloseTitleDialog}>
          <DialogTitle>{editScript ? 'Edit Script' : 'Create New Script'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={newScriptTitle}
              onChange={(e) => setNewScriptTitle(e.target.value)}
              error={!!createScriptError}
              helperText={createScriptError}
            />
            <DatePicker
              label="Shooting Date"
              value={newScriptShootingDate}
              onChange={(newValue) => setNewScriptShootingDate(newValue)}
              renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newScriptDescription}
              onChange={(e) => setNewScriptDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTitleDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={editScript ? handleUpdateScript : handleCreateScript}
              color="primary"
              variant="contained"
              disabled={createScriptLoading}
            >
              {createScriptLoading ? <CircularProgress size={24} /> : (editScript ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the script "{scriptToDelete?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={createScriptLoading}
            >
              {createScriptLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}