import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Divider, IconButton, Tooltip, Fab
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import AddProjectModal from './AddProjectModal';
import api from './api'; // Import api.js

export default function CategoryDashboard() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const theme = useTheme();

  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState(null);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      const filtered = response.data.filter(p => p.categoryId === categoryId);
      setProjects(filtered);
    } catch (err) {
      console.error('Projects fetch failed:', err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    const handleGlobalSearch = (e) => {
      setSearchQuery(e.detail); // your internal state
    };
    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => window.removeEventListener('globalSearch', handleGlobalSearch);
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get('/categories');
        const found = response.data.find(c => c._id === categoryId);
        setCategory(found);
      } catch (err) {
        console.error('Categories fetch failed:', err.response?.status, err.response?.data);
      }
    };   

    fetchCategory();
    fetchProjects();
  }, [categoryId]);

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error('Delete project failed:', err.response?.status, err.response?.data);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', pr: 4, pl: 0, pt: 3, pb: 8, boxSizing: 'border-box' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>📁 {category?.name || 'Category'} Projects</Typography>

      <Typography variant="body1" mb={2}>{category?.description || 'No description provided.'}</Typography>

      <Divider sx={{ mb: 3 }} />

      {projects.length > 0 ? (
        <Grid container spacing={2}>
          {projects.map(project => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card
                onClick={() => navigate(`/project/${project._id}`)}
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
                  <Typography variant="h6">{project.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions className="actions" sx={{ justifyContent: 'flex-end', opacity: 0, transition: '0.3s' }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/edit-project/${project._id}`); }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project._id); }}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" mt={2}>
          No projects found. Click ➕ to add your first project.
        </Typography>
      )}

      {/* Floating Add Project Button */}
      <Box
        onMouseEnter={() => setHoverAdd(true)}
        onMouseLeave={() => setHoverAdd(false)}
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
            bgcolor: theme.palette.mode === 'light' ? '#00b894' : '#55efc4',
            color: 'white',
            px: hoverAdd ? 2 : 0,
            py: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            width: hoverAdd ? 'auto' : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: hoverAdd ? 1 : 0,
          }}
        >
          Add Project
        </Box>
        <Fab
          sx={{
            bgcolor: theme.palette.mode === 'light' ? '#00b894' : '#55efc4',
            '&:hover': {
              bgcolor: theme.palette.mode === 'light' ? '#00a383' : '#2ecc71'
            }
          }}
          size="medium"
          onClick={() => setOpenAddProject(true)}
        >
          <Add />
        </Fab>
      </Box>
      <AddProjectModal
        open={openAddProject}
        onClose={() => setOpenAddProject(false)}
        onCreated={fetchProjects}
        categoryId={categoryId}
        categoryName={category?.name}
      />
    </Box>
  );
}