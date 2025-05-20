


import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, LinearProgress
} from '@mui/material';

const UploadModal = ({
  open,
  onClose,
  onUploadComplete,
  isDraftUpload = false,
  existingTitle = ""
}) => {
  const [title, setTitle] = useState("");
  const [shootDate, setShootDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [aiProgress, setAiProgress] = useState({ index: 0, total: 0 });
  const [aiScenes, setAiScenes] = useState([]);

  const API = "http://localhost:3001/api/ai"; // Using /api/ai route

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalTitle = isDraftUpload ? existingTitle : title;

    if (!finalTitle || (!isDraftUpload && !shootDate) || !selectedFile) {
      setMessage("Please fill in all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("script", selectedFile);

    setUploading(true);
    setMessage("");

    try {
      // Step 1: Upload file to Gemini AI
      const uploadRes = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.total) throw new Error("No scenes detected");

      // Step 2: Start breakdown
      await fetch(`${API}/start-breakdown`, { method: "POST" });

      // Step 3: Open stream
      const eventSource = new EventSource(`${API}/stream`);
      const scenes = [];

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        scenes.push(data.scene);
        setAiScenes([...scenes]);
        setAiProgress({ index: data.index, total: data.total });

        if (data.index === data.total) {
          eventSource.close();
          setUploading(false);
          if (onUploadComplete) onUploadComplete(scenes); // Pass to parent
          onClose();
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        setMessage("❌ AI Breakdown failed. Please try again.");
        setUploading(false);
        eventSource.close();
      };
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("❌ Upload error: " + err.message);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isDraftUpload ? "Upload New Draft" : "Upload Script"}</DialogTitle>
      <DialogContent>
        {!isDraftUpload && (
          <>
            <TextField
              label="Script Title"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Shooting Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={shootDate}
              onChange={(e) => setShootDate(e.target.value)}
            />
          </>
        )}

        <Box mt={2}>
          <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
        </Box>

        {uploading && (
          <Box mt={2}>
            <Typography variant="body2">Streaming breakdown...</Typography>
            <LinearProgress />
            <Typography variant="caption">
              {aiProgress.index} of {aiProgress.total} scenes processed
            </Typography>
          </Box>
        )}

        {message && (
          <Typography color="error" mt={2}>
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={uploading}>
          Run AI Breakdown
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
