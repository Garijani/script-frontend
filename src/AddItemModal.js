//src/AddItemModal.js

import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Switch, FormControlLabel, Autocomplete, Collapse
} from '@mui/material';
import { AddCircle, ExpandMore, ExpandLess } from '@mui/icons-material';
import api from './api'; // or your actual axios instance path

export default function AddItemModal({ open, onClose, fieldsSchema, onSave }) {
  const [values, setValues] = useState({});
  const [hasAccessories, setHasAccessories] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [showAccessoryPicker, setShowAccessoryPicker] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (open) {
      const init = {};
      fieldsSchema.forEach(f => { init[f] = ''; });
      setValues(init);
      setAccessories([]);
      setHasAccessories(false);

      // Load all inventory items for accessory selection
      api.get('/inventory')
        .then(res => setAllItems(res.data))
        .catch(err => console.error('Failed to fetch accessories:', err));
    }
  }, [open, fieldsSchema]);

  const handleSave = () => {
    const payload = {
      ...values,
      accessories: hasAccessories ? accessories.map(i => i._id) : []
    };
    onSave(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 500, maxHeight: '90vh', overflowY: 'auto'
      }}>
        <Typography variant="h6" mb={2}>Add New Item</Typography>

        {fieldsSchema.map(field => (
          <TextField
            key={field}
            label={field}
            fullWidth
            margin="dense"
            value={values[field] || ''}
            onChange={e => setValues(v => ({ ...v, [field]: e.target.value }))}
          />
        ))}

        <FormControlLabel
          control={<Switch checked={hasAccessories} onChange={e => setHasAccessories(e.target.checked)} />}
          label="Has Accessories?"
          sx={{ mt: 2 }}
        />

        {hasAccessories && (
          <>
            <Button
              variant="outlined"
              onClick={() => setShowAccessoryPicker(prev => !prev)}
              endIcon={showAccessoryPicker ? <ExpandLess /> : <ExpandMore />}
              sx={{ mt: 1 }}
            >
              {showAccessoryPicker ? 'Hide Accessory Picker' : 'Select Accessories'}
            </Button>

            <Collapse in={showAccessoryPicker}>
              <Autocomplete
                multiple
                options={allItems}
                getOptionLabel={(item) => item.fields?.['Item Name'] || 'Unnamed'}
                onChange={(_, value) => setAccessories(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Accessories" margin="normal" />
                )}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </>
        )}

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
