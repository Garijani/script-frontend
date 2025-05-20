// // frontend/src/FileUpload.js


// export default FileUpload;
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

console.log("🚀 FileUpload component loaded");

const FileUpload = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Hardcoded for now to avoid .env issues
  const API = "http://localhost:3001";

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("scriptFile", selectedFile);
    formData.append("title", title);

    setUploading(true);
    setMessage("");

    try {
      console.log("Sending upload to:", `${API}/upload`);
      console.log("FormData file:", selectedFile);
      console.log("FormData title:", title);

      const response = await fetch(`${API}/upload`, {
        method: "POST",
        headers: {
          username: "admin",
          password: "admin",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      setMessage("Upload successful!");

      if (onUploadComplete) {
        onUploadComplete(data.savedScript);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2, maxWidth: 600, mx: "auto" }} elevation={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Upload a Script File
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Script Title"
            fullWidth
            value={title}
            onChange={handleTitleChange}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "block", margin: "0 auto" }}
          />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Button variant="contained" color="primary" type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      </form>
      {message && (
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default FileUpload;
