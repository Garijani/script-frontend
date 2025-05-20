//src/FullBreakdown.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box,
  Card, CardContent, Chip, Select, MenuItem, TextField, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tooltip, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import {
  ArrowBack, CloudUpload, CompareArrows, Delete, Edit, LightMode, DarkMode, Save, Close, Add
} from '@mui/icons-material';
import UploadModal from './UploadModal';
import DraftComparison from './DraftComparison';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Breadcrumbs, Link as MuiLink, LinearProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from './api'; // Import api.js

const intExtOptions = ['INT', 'EXT'];
const timeOptions = ['DAY', 'NIGHT'];
const setOptions = ['REAL', 'VIRTUAL'];

export default function FullBreakdown() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("sceneNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterIntExt, setFilterIntExt] = useState(null);
  const [filterTime, setFilterTime] = useState(null);
  const [filterSet, setFilterSet] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [compareMode, setCompareMode] = useState(false);
  const [draftIndexA, setDraftIndexA] = useState(0);
  const [draftIndexB, setDraftIndexB] = useState(1);
  const [addSceneOpen, setAddSceneOpen] = useState(false);
  const [newSceneData, setNewSceneData] = useState({
    sceneNumber: '',
    location: '',
    intExt: '',
    time: '',
    set: '',
    characters: '',
    actionSummary: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [projectName, setProjectName] = useState("Project");
  // AI Breakdown states
  const [aiFile, setAiFile] = useState(null);
  const [aiSceneNumbers, setAiSceneNumbers] = useState([]);
  const [aiScenes, setAiScenes] = useState([]);
  const [aiProgress, setAiProgress] = useState({ index: 0, total: 0 });
  const [aiStreamStarted, setAiStreamStarted] = useState(false);
  const [aiError, setAiError] = useState("");
  const [newDraftIndex, setNewDraftIndex] = useState(null);

  const API = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await api.get(`/scripts/${id}`);
        setScript(response.data);
        setSelectedDraft(response.data.drafts.length - 1);
        setLoading(false);
      } catch (err) {
        setError(err.response?.status === 401 ? 'Unauthorized: Please log in again.' : err.message);
        setLoading(false);
      }
    };
    fetchScript();
  }, [id]);

  useEffect(() => {
    if (!aiStreamStarted) return;

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${API}/ai/stream?token=${token}`);
    const streamedScenes = [];

    eventSource.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      streamedScenes.push(data.scene);
      setAiScenes([...streamedScenes]);
      setAiProgress({ index: data.index, total: data.total });

      // Append the new scene to the draft in the database
      if (newDraftIndex !== null) {
        try {
          const sceneToSave = {
            sceneNumber: data.scene.SceneNumber,
            intExt: data.scene["INT/EXT"],
            location: data.scene.Lokasi,
            time: data.scene.Waktu,
            characters: data.scene.Karakter?.join(", ") ?? "",
            set: "",
            actionSummary: data.scene.ActionSummary || "Feature not available",
          };

          await api.put(`/scripts/${script._id}/drafts/${newDraftIndex}/breakdown`, { scene: sceneToSave });
        } catch (err) {
          console.error("❌ Failed to append scene:", err);
          setSnackbarMessage(`Failed to append scene: ${err.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }

      if (data.index === data.total) {
        eventSource.close();
        setAiStreamStarted(false);

        // Refetch the script to ensure the draft is up-to-date
        try {
          const response = await api.get(`/scripts/${script._id}`);
          const updated = response.data;
          setScript(updated);
          setSelectedDraft(newDraftIndex); // Ensure we're still on the new draft
        } catch (err) {
          console.error("❌ Failed to refetch script:", err);
          setSnackbarMessage(`Failed to refetch script: ${err.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }

        // 🎉 Feedback
        setSnackbarMessage("AI Breakdown completed and saved!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Clear aiScenes to show the draft's breakdown
        setAiScenes([]);
        setNewDraftIndex(null); // Reset the new draft index
      }
    };

    eventSource.onerror = () => {
      setAiError("Streaming error");
      setAiStreamStarted(false);
      setNewDraftIndex(null);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [aiStreamStarted, API, script?._id, newDraftIndex]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const toggleFilter = (setter, current, value) => setter(current === value ? null : value);

  const renderChipGroup = (label, value, setter, options) => (
    <Box>
      <Typography variant="body2" fontWeight="bold" gutterBottom>{label}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map(opt => (
          <Chip
            key={opt}
            label={opt}
            color={value === opt ? "primary" : "default"}
            onClick={() => toggleFilter(setter, value, opt)}
            clickable
          />
        ))}
      </Box>
    </Box>
  );

  const rows = aiScenes.length > 0
    ? aiScenes.map(scene => ({
        sceneNumber: scene.SceneNumber,
        intExt: scene["INT/EXT"],
        location: scene.Lokasi,
        time: scene.Waktu,
        characters: scene.Karakter?.join(", ") ?? "",
        set: "",
        actionSummary: scene.ActionSummary || "Feature not available",
      }))
    : script?.drafts?.[selectedDraft]?.breakdown || [];

  const filteredRows = rows
    .filter(scene => {
      const search = searchQuery.toLowerCase();
      return (
        String(scene.sceneNumber).toLowerCase().includes(search) ||
        scene.location?.toLowerCase().includes(search) ||
        scene.characters?.toLowerCase().includes(search) ||
        scene.actionSummary?.toLowerCase().includes(search) ||
        scene.intExt?.toLowerCase().includes(search) ||
        scene.time?.toLowerCase().includes(search) ||
        scene.set?.toLowerCase().includes(search)
      );
    })
    .filter(scene =>
      (!filterIntExt || scene.intExt === filterIntExt) &&
      (!filterTime || scene.time === filterTime) &&
      (!filterSet || scene.set === filterSet)
    )
    .sort((a, b) => {
      const getSceneParts = (scene) => {
        const match = String(scene.sceneNumber).match(/^(\d+)([a-zA-Z]*)$/);
        return match ? [parseInt(match[1]), match[2] || ''] : [0, ''];
      };

      if (sortBy === "sceneNumber") {
        const [numA, sufA] = getSceneParts(a);
        const [numB, sufB] = getSceneParts(b);

        if (numA !== numB) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }

        return sortOrder === 'asc'
          ? sufA.localeCompare(sufB)
          : sufB.localeCompare(sufA);
      }

      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData({ ...filteredRows[index] });
  };

  const handleSave = async () => {
    if (aiScenes.length > 0) {
      // If showing aiScenes, update aiScenes state
      const updatedAiScenes = [...aiScenes];
      updatedAiScenes[editingIndex] = {
        SceneNumber: editData.sceneNumber,
        "INT/EXT": editData.intExt,
        Lokasi: editData.location,
        Waktu: editData.time,
        Karakter: editData.characters ? editData.characters.split(", ") : [],
        set: editData.set,
        ActionSummary: editData.actionSummary,
      };
      setAiScenes(updatedAiScenes);
      setEditingIndex(null);
    } else {
      // If showing draft, update the draft and save to backend
      const updatedScenes = [...script.drafts[selectedDraft].breakdown];
      updatedScenes[editingIndex] = editData;

      try {
        await api.put(`/scripts/${script._id}/drafts/${selectedDraft}`, { ...editData, rowIndex: editingIndex });

        const updatedDrafts = script.drafts.map((d, i) =>
          i === selectedDraft ? { ...d, breakdown: updatedScenes } : d
        );
        setScript({ ...script, drafts: updatedDrafts });
        setEditingIndex(null);
      } catch (err) {
        alert("Failed to save row");
      }
    }
  };

  const handleAddScene = async () => {
    try {
      if (aiScenes.length > 0) {
        // If showing aiScenes, append to aiScenes
        const newScene = {
          SceneNumber: newSceneData.sceneNumber,
          "INT/EXT": newSceneData.intExt,
          Lokasi: newSceneData.location,
          Waktu: newSceneData.time,
          Karakter: newSceneData.characters ? newSceneData.characters.split(", ") : [],
          set: newSceneData.set,
          ActionSummary: newSceneData.actionSummary,
        };
        setAiScenes([...aiScenes, newScene]);
      } else {
        // If showing draft, append to draft and save to backend
        const updatedScenes = [...script.drafts[selectedDraft].breakdown, newSceneData];

        await api.put(`/scripts/${script._id}/drafts/${selectedDraft}/add`, newSceneData);

        const updatedDrafts = script.drafts.map((d, i) =>
          i === selectedDraft ? { ...d, breakdown: updatedScenes } : d
        );
        setScript({ ...script, drafts: updatedDrafts });
      }

      setNewSceneData({
        sceneNumber: '',
        location: '',
        intExt: '',
        time: '',
        set: '',
        characters: '',
        actionSummary: ''
      });
      setAddSceneOpen(false);

      setSnackbarMessage('Scene added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to add scene.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this scene?")) return;

    if (aiScenes.length > 0) {
      // If showing aiScenes, update aiScenes state
      const updatedAiScenes = aiScenes.filter((_, i) => i !== index);
      setAiScenes(updatedAiScenes);
    } else {
      // If showing draft, update the draft and save to backend
      const updatedBreakdown = script.drafts[selectedDraft].breakdown.filter((_, i) => i !== index);
      const updatedDrafts = script.drafts.map((d, i) =>
        i === selectedDraft ? { ...d, breakdown: updatedBreakdown } : d
      );
      setScript({ ...script, drafts: updatedDrafts });

      // Save the updated draft to the backend
      try {
        await api.put(`/scripts/${script._id}/drafts/${selectedDraft}`, { breakdown: updatedBreakdown });
      } catch (err) {
        setSnackbarMessage("Failed to delete scene.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const exportToCSV = () => {
    const data = script.drafts[selectedDraft].breakdown.map(scene => ({
      "Scene #": scene.sceneNumber,
      Location: scene.location,
      "INT/EXT": scene.intExt,
      Time: scene.time,
      Set: scene.set,
      Characters: scene.characters,
      Action: scene.actionSummary
    }));
    const blob = new Blob([Papa.unparse(data)], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${script.title}_breakdown.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Breakdown: ${script.title}`, 10, 10);
    doc.autoTable({
      startY: 20,
      head: [["Scene #", "Location", "INT/EXT", "Time", "Set", "Characters", "Action"]],
      body: script.drafts[selectedDraft].breakdown.map(scene => [
        scene.sceneNumber,
        scene.location,
        scene.intExt,
        scene.time,
        scene.set,
        scene.characters,
        scene.actionSummary
      ])
    });
    doc.save(`${script.title}_breakdown.pdf`);
  };

  const handleAiStartBreakdown = async () => {
    try {
      // Create an empty draft
      const response = await api.post(`/scripts/${script._id}/drafts`, { breakdown: [] });

      // Refetch the script to get the updated drafts
      const res = await api.get(`/scripts/${script._id}`);
      const updated = res.data;
      console.log("Updated script with new draft:", updated);

      // Update state to "redirect" to the new draft
      setScript(updated);
      const newIndex = updated.drafts.length - 1;
      setNewDraftIndex(newIndex); // Store the new draft index for streaming
      setSelectedDraft(newIndex); // "Redirect" by switching to the new draft

      // Start the AI breakdown
      await api.post('/ai/start-breakdown');
      setAiStreamStarted(true);
    } catch (err) {
      setAiError(`Failed to start breakdown: ${err.message}`);
      setSnackbarMessage(`Failed to start breakdown: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAiUpload = async () => {
    if (!aiFile) return setAiError("Please select a script file");
    const formData = new FormData();
    formData.append("script", aiFile);

    try {
      setAiError("");
      setAiSceneNumbers([]);
      setAiProgress({ index: 0, total: 0 });
      setAiStreamStarted(false);
      setAiScenes([]);

      const response = await api.post('/ai/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data;
      if (!data.total) throw new Error("No scenes detected");

      setAiSceneNumbers(data.sceneNumbers);
      setAiProgress((prev) => ({ ...prev, total: data.total }));
    } catch (err) {
      setAiError("Upload failed: " + err.message);
    }
  };

  const renderEditField = (field, value, setValue) => {
    if (field === 'intExt') {
      return (
        <FormControl fullWidth margin="dense">
          <InputLabel>INT/EXT</InputLabel>
          <Select value={value || ''} onChange={(e) => setValue(e.target.value)} label="INT/EXT">
            <MenuItem value="INT">INT</MenuItem>
            <MenuItem value="EXT">EXT</MenuItem>
          </Select>
        </FormControl>
      );
    }
    if (field === 'time') {
      return (
        <FormControl fullWidth margin="dense">
          <InputLabel>Time</InputLabel>
          <Select value={value || ''} onChange={(e) => setValue(e.target.value)} label="Time">
            <MenuItem value="DAY">DAY</MenuItem>
            <MenuItem value="NIGHT">NIGHT</MenuItem>
          </Select>
        </FormControl>
      );
    }
    if (field === 'set') {
      return (
        <FormControl fullWidth margin="dense">
          <InputLabel>Set</InputLabel>
          <Select value={value || ''} onChange={(e) => setValue(e.target.value)} label="Set">
            <MenuItem value="REAL">REAL</MenuItem>
            <MenuItem value="VIRTUAL">VIRTUAL</MenuItem>
          </Select>
        </FormControl>
      );
    }
    return (
      <TextField
        label={field}
        value={value || ''}
        fullWidth
        multiline={field === 'actionSummary'}
        onChange={e => setValue(e.target.value)}
        margin="dense"
      />
    );
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  if (compareMode) {
    return (
      <Box>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => setCompareMode(false)}><ArrowBack /></IconButton>
              <Typography variant="h6" noWrap>Compare Drafts</Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Card sx={{ m: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Select Drafts to Compare</Typography>
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Draft A</InputLabel>
              <Select value={draftIndexA} onChange={(e) => setDraftIndexA(e.target.value)} label="Draft A">
                {script.drafts.map((_, i) => (
                  <MenuItem key={i} value={i}>Draft {i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Draft B</InputLabel>
              <Select value={draftIndexB} onChange={(e) => setDraftIndexB(e.target.value)} label="Draft B">
                {script.drafts.map((_, i) => (
                  <MenuItem key={i} value={i}>Draft {i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Card>

        <DraftComparison
          script={script}
          draftIndexA={draftIndexA}
          draftIndexB={draftIndexB}
        />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ px: 3, py: 4, maxWidth: '1440px', mx: 'auto' }}>
        {/* Page Heading */}
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink
            component={RouterLink}
            to="/"
            underline="hover"
            color="inherit"
            sx={{ fontWeight: 500 }}
          >
            Home
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to={`/project/${script.projectId || 'default'}`}
            underline="hover"
            color="inherit"
            sx={{ fontWeight: 500 }}
          >
            Project
          </MuiLink>
          <Typography color="text.primary" fontWeight={500}>
            Breakdown
          </Typography>
        </Breadcrumbs>

        <Typography variant="h5" fontWeight={600} mb={1}>
          Scene Breakdown – {script.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Draft {selectedDraft + 1} • Total Scenes: {filteredRows.length}
        </Typography>

        {/* 🧠 Gemini AI Breakdown Block */}
        <Box mb={4} p={3} border="1px solid #ccc" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            🧠 AI-Powered Scene Breakdown
          </Typography>

          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setAiFile(e.target.files[0])}
          />
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={handleAiUpload}
            disabled={aiStreamStarted}
          >
            Upload & Detect Scenes
          </Button>

          {aiError && <Typography color="error" mt={2}>{aiError}</Typography>}

          {aiSceneNumbers.length > 0 && (
            <Box mt={2}>
              <Typography variant="body1">
                ✅ Detected {aiSceneNumbers.length} scenes
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {aiSceneNumbers.map((s, i) => (
                  <Chip key={i} label={s} />
                ))}
              </Box>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleAiStartBreakdown}
                disabled={aiStreamStarted}
              >
                🚀 Start Breakdown
              </Button>
            </Box>
          )}

          {aiStreamStarted && (
            <Box mt={2}>
              <LinearProgress />
              <Typography variant="caption">
                Scene {aiProgress.index} / {aiProgress.total}
              </Typography>
            </Box>
          )}
           
        </Box>

        {/* Search, Filter, Draft & Action Toolbar inside one card */}
        <Card elevation={1} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            {/* Row 1: Search (full width) */}
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Search..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </Box>

            {/* Row 2: Filters + Draft Selector + Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: 'wrap',
                gap: 3,
                alignItems: 'flex-start',
              }}
            >
              {/* Filters */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flex: 1 }}>
                {renderChipGroup("INT/EXT", filterIntExt, setFilterIntExt, intExtOptions)}
                {renderChipGroup("TIME", filterTime, setFilterTime, timeOptions)}
                {renderChipGroup("SET", filterSet, setFilterSet, setOptions)}
              </Box>

              {/* Draft Selector */}
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Draft</InputLabel>
                <Select
                  value={selectedDraft}
                  label="Draft"
                  onChange={(e) => setSelectedDraft(e.target.value)}
                >
                  {script.drafts.map((_, i) => (
                    <MenuItem key={i} value={i}>Draft {i + 1}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="Add New Scene">
                  <IconButton onClick={() => setAddSceneOpen(true)}><Add /></IconButton>
                </Tooltip>
                <Tooltip title="Upload Draft">
                  <IconButton onClick={() => setUploadOpen(true)}><CloudUpload /></IconButton>
                </Tooltip>
                <Tooltip title="Compare Drafts">
                  <IconButton onClick={() => setCompareMode(true)}><CompareArrows /></IconButton>
                </Tooltip>
                <Tooltip title="Export CSV">
                  <IconButton onClick={exportToCSV}>CSV</IconButton>
                </Tooltip>
                <Tooltip title="Export PDF">
                  <IconButton onClick={exportToPDF}>PDF</IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Scene Table Card */}
        <Card elevation={1} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["sceneNumber", "location", "intExt", "time", "set", "characters", "actionSummary"].map(col => (
                      <TableCell
                        key={col}
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => handleSort(col)}
                      >
                        {col.toUpperCase()} {sortBy === col && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                    ))}
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((scene, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{scene.sceneNumber}</TableCell>
                      <TableCell>{scene.location}</TableCell>
                      <TableCell>{scene.intExt}</TableCell>
                      <TableCell>{scene.time}</TableCell>
                      <TableCell>{scene.set}</TableCell>
                      <TableCell>{scene.characters}</TableCell>
                      <TableCell>{scene.actionSummary}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(i)}><Edit /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(i)}><Delete /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Upload Modal */}
        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUploadComplete={() => window.location.reload()}
          isDraftUpload
          existingTitle={script.title}
        />

        {/* Edit Dialog */}
        <Dialog open={editingIndex !== null} onClose={() => setEditingIndex(null)}>
          <DialogTitle>Edit Scene</DialogTitle>
          <DialogContent>
            {["sceneNumber", "location", "intExt", "time", "set", "characters", "actionSummary"].map((field) => (
              <Box key={field}>
                {renderEditField(field, editData[field], (val) => setEditData({ ...editData, [field]: val }))}
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button startIcon={<Close />} onClick={() => setEditingIndex(null)}>Cancel</Button>
            <Button startIcon={<Save />} variant="contained" onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add New Scene Dialog */}
        <Dialog open={addSceneOpen} onClose={() => setAddSceneOpen(false)}>
          <DialogTitle>Add New Scene</DialogTitle>
          <DialogContent>
            {["sceneNumber", "location", "intExt", "time", "set", "characters", "actionSummary"].map(field => (
              <Box key={field} mt={1}>
                {renderEditField(field, newSceneData[field], (val) => setNewSceneData({ ...newSceneData, [field]: val }))}
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button startIcon={<Close />} onClick={() => setAddSceneOpen(false)}>Cancel</Button>
            <Button startIcon={<Save />} variant="contained" onClick={handleAddScene}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Snackbar Feedback */}
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
    </>
  );
}