


// frontend/src/HomeDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Divider, IconButton, Tooltip, Chip, Stack,
  TextField, FormControl, Select, MenuItem, Fab
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from './AddCategoryModal';
import AddModuleModal from './AddModuleModal';
import api from './api';

export default function HomeDashboard() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [globalModules, setGlobalModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openAddModule, setOpenAddModule] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [hoverCat, setHoverCat] = useState(false);
  const [hoverMod, setHoverMod] = useState(false);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoriesRes = await api.get('/categories');
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);

      const modulesRes = await api.get('/modules');
      setGlobalModules(Array.isArray(modulesRes.data) ? modulesRes.data : []);

      const projectsRes = await api.get('/projects');
      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);

      setLoading(false);
    } catch (err) {
      console.error('Fetch Error:', err.message);
      setError(err.response?.status === 401 ? 'Unauthorized: Please log in again.' : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getProjectCount = (categoryId) =>
    projects.filter(p => p.categoryId === categoryId).length;

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/categories/${id}`);
      refreshData();
    } catch (err) {
      console.error('Delete Category Error:', err.message);
      setError('Failed to delete category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/modules/${id}`);
      refreshData();
    } catch (err) {
      console.error('Delete Module Error:', err.message);
      setError('Failed to delete module');
    }
  };

  const handleEditModule = (mod) => {
    setEditingModule(mod);
    setOpenAddModule(true);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box
      sx={{
        width: '100%',
        pr: 4, pl: 0, ml: 0,
        pt: 3, pb: 8,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎬 Master Dashboard
      </Typography>

      {/* Categories Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">📁 Production Categories</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {/* Category Filters */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField size="small" placeholder="Search categories…" variant="outlined" sx={{ width: 250 }} />
        <FormControl size="small">
          <Select defaultValue="az">
            <MenuItem value="az">A-Z</MenuItem>
            <MenuItem value="projects">Most Projects</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Category Cards */}
      <Grid container spacing={2} mb={4}>
        {categories.length > 0 ? (
          categories.map(category => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card
                onClick={() => navigate(`/category/${category._id}`)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  transition: '0.3s',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    '.actions': { opacity: 1 }
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6">{category.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {category.description}
                  </Typography>
                  <Chip
                    label={`${getProjectCount(category._id)} Projects`}
                    size="small"
                    color="primary"
                  />
                </CardContent>
                <CardActions className="actions" sx={{ justifyContent: 'flex-end', opacity: 0, transition: '0.3s' }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={e => { e.stopPropagation(); handleEditCategory(category); }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={e => { e.stopPropagation(); handleDeleteCategory(category._id); }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2">No categories available yet.</Typography>
          </Grid>
        )}
      </Grid>

      {/* Modules Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5} mb={1}>
        <Typography variant="h6">🛠 Global Management Modules</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {/* Module Cards */}
      <Grid container spacing={2}>
        {globalModules.length > 0 ? (
          globalModules.map(mod => (
            <Grid item xs={12} sm={6} md={4} key={mod._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    '.actions': { opacity: 1 }
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {mod.icon || '🛠'} {mod.name}
                  </Typography>
                </CardContent>
                <CardActions className="actions" sx={{ justifyContent: 'flex-end', opacity: 0, transition: '0.3s' }}>
                  <Button onClick={() => navigate(`/module/${mod.route.replace(/^\/+/, '')}`)}>
                    Open
                  </Button>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditModule(mod)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDeleteModule(mod._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2">
              No modules available yet.{' '}
              <Button size="small" onClick={() => { setEditingModule(null); setOpenAddModule(true); }}>
                Add Module
              </Button>
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Resource Booking Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5} mb={1}>
        <Typography variant="h6">📅 Resource Booking</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: '0.3s',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '.actions': { opacity: 1 }
              }
            }}
          >
            <CardContent>
              <Typography variant="h6">
                📅 Book Item
              </Typography>
            </CardContent>
            <CardActions className="actions" sx={{ justifyContent: 'flex-end', opacity: 0, transition: '0.3s' }}>
              <Button onClick={() => navigate('/requests/new')}>
                Open
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Add Category */}
      <Box
        onMouseEnter={() => setHoverCat(true)}
        onMouseLeave={() => setHoverCat(false)}
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            px: hoverCat ? 2 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            width: hoverCat ? 'auto' : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: hoverCat ? 1 : 0,
          }}
        >
          Add Category
        </Box>
        <Fab color="primary" size="medium" onClick={() => { setEditingCategory(null); setOpenModal(true); }}>
          <Add />
        </Fab>
      </Box>

      {/* Floating Add Module */}
      <Box
        onMouseEnter={() => setHoverMod(true)}
        onMouseLeave={() => setHoverMod(false)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            px: hoverMod ? 2 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            width: hoverMod ? 'auto' : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: hoverMod ? 1 : 0,
          }}
        >
          Add Module
        </Box>
        <Fab color="secondary" size="medium" onClick={() => { setEditingModule(null); setOpenAddModule(true); }}>
          <Add />
        </Fab>
      </Box>

      {/* Modals */}
      <AddCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={refreshData}
        existing={editingCategory}
      />
      <AddModuleModal
        open={openAddModule}
        onClose={() => setOpenAddModule(false)}
        onCreated={refreshData}
        existing={editingModule}
      />
    </Box>
  );
}