// frontend/src/components/DynamicModulePage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import AddItemModal from './AddItemModal';
import EquipmentTable from './EquipmentTable';
import api from './api';

export default function DynamicModulePage() {
  const { moduleName } = useParams();
  const [module, setModule] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: mod } = await api.get(`/modules/route/${moduleName}`);
      setModule(mod);

      const { data: inv } = await api.get(`/inventory?moduleName=${moduleName}`);
      setItems(inv);
    } catch (err) {
      console.error('Failed to fetch module or inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleName]);

  const handleDeleteRow = async (id) => {
    setItems(prev => prev.filter(item => item._id !== id));
    try {
      await api.delete(`/inventory/${id}`);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleEditCell = async (rowId, col, newValue) => {
    setItems(prev =>
      prev.map(item =>
        item._id === rowId
          ? { ...item, fields: { ...item.fields, [col]: newValue } }
          : item
      )
    );
    try {
      await api.put(`/inventory/${rowId}`, {
        fields: { ...items.find(i => i._id === rowId).fields, [col]: newValue }
      });
    } catch (err) {
      console.error('Failed to save edit:', err);
    }
  };

  const patchFields = async (updated) => {
    setModule(prev => ({ ...prev, fieldsSchema: updated }));
    try {
      await api.patch(`/modules/${module._id}/fields`, {
        fieldsSchema: updated
      });
    } catch (err) {
      console.error('Failed to update schema:', err);
    }
  };

  const handleDeleteColumn = idx =>
    patchFields(module.fieldsSchema.filter((_, i) => i !== idx));
  const handleAddColumnLeft = idx => {
    const name = `Column ${module.fieldsSchema.length + 1}`;
    patchFields([
      ...module.fieldsSchema.slice(0, idx),
      name,
      ...module.fieldsSchema.slice(idx)
    ]);
  };
  const handleAddColumnRight = idx => {
    const name = `Column ${module.fieldsSchema.length + 1}`;
    patchFields([
      ...module.fieldsSchema.slice(0, idx + 1),
      name,
      ...module.fieldsSchema.slice(idx + 1)
    ]);
  };
  const handleRenameColumn = (idx, newName) => {
    const updated = [...module.fieldsSchema];
    updated[idx] = newName;
    patchFields(updated);
  };

  if (loading || !module) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  // 🔧 Ensure 'Accessories' column is present
  const fieldsSchemaWithAccessories = module.fieldsSchema.includes('Accessories')
    ? module.fieldsSchema
    : [...module.fieldsSchema, 'Accessories'];

  const rows = items.map(i => {
    const values = i.fields?.values || i.fields || {};
    const accessories = i.fields?.accessories || [];
  
    return {
      id: i._id,
      ...values,
      Accessories: accessories.map(a => `${a.name}`).join(', ')
    };
  });
  

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📋 {module.name} Module
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setShowAddModal(true)}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>

      <EquipmentTable
        columns={fieldsSchemaWithAccessories}
        rows={rows}
        onDeleteRow={handleDeleteRow}
        onDeleteColumn={handleDeleteColumn}
        onAddColumnLeft={handleAddColumnLeft}
        onAddColumnRight={handleAddColumnRight}
        onRenameColumn={handleRenameColumn}
        onEditCell={handleEditCell}
      />

      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        fieldsSchema={module.fieldsSchema}
        onSave={async (values) => {
          setShowAddModal(false);
          try {
            const { data: newItem } = await api.post('/inventory', {
              moduleId: module._id,
              fields: values,
            });
            setItems(prev => [...prev, newItem]);
          } catch (err) {
            console.error('Failed to add item:', err);
          }
        }}
      />
    </Box>
  );
}
