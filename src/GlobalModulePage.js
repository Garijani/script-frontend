

// frontend/src/GlobalModulePage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import AddItemModal from './AddItemModal';
import EquipmentTable from './EquipmentTable';
import api from './api'; // ✅ Import your secured API instance

export default function DynamicModulePage() {
  const { moduleName } = useParams();
  const [module, setModule] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Fetch module schema + items
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: moduleData } = await api.get(`/modules/route/${moduleName}`);
      setModule(moduleData);

      const { data: inventoryItems } = await api.get(`/api/inventory?moduleName=${moduleName}`);
      setItems(inventoryItems);
    } catch (err) {
      console.error('Failed to fetch module/inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleName]);

  // ✅ Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/api/inventory/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Placeholder edit handler
  const handleEdit = (id) => {
    alert('Edit functionality coming soon for: ' + id);
  };

  // Show loading
  if (loading || !module) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }


  const columns = module.fieldsSchema; // ✅ this matches what EquipmentTable expects


  const rows = items.map(item => ({
    id: item._id,
    ...item.fields
  }));

  // Optional: Append accessory names into a column
rows.forEach(row => {
  const item = items.find(i => i._id === row.id);
  row['Accessories'] = item?.accessories?.map(a => a.fields?.['Item Name']).join(', ') || '';
});

// Add "Accessories" column if not in schema
if (!columns.includes('Accessories')) {
  columns.push('Accessories');
}


  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📋 {module.name} Module
      </Typography>

      <Box mb={2} display="flex" gap={1}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddModal(true)}
        >
          Add Item
        </Button>
      </Box>

      <EquipmentTable
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        fieldsSchema={module.fieldsSchema}
        onSave={async (values) => {
          try {
            await api.post('/api/inventory', {
              moduleId: module._id,
              fields: values,
            });
            setShowAddModal(false);
            fetchData();
          } catch (err) {
            console.error('Failed to add item:', err);
          }
        }}
      />
    </Box>
  );
}

