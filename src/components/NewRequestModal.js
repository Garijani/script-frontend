

// import React, { useEffect, useState } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Select, MenuItem, InputLabel, FormControl,
//   FormGroup, FormControlLabel, Switch, Button, Typography,
//   Box, CircularProgress, Collapse, IconButton
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import Fuse from 'fuse.js';
// import api from '../api';

// const NewRequestModal = ({ open, onClose, onSuccess }) => {
//   const [modules, setModules] = useState([]);
//   const [items, setItems] = useState([]);
//   const [groupList, setGroupList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [separateAccessories, setSeparateAccessories] = useState(false);
//   const [expanded, setExpanded] = useState({});
//   const [form, setForm] = useState({
//     purpose: '',
//     dateUsed: '',
//     returnDate: '',
//     destination: '',
//     moduleId: '',
//     group: '',
//     showAvailableOnly: true,
//     selectedItems: [],
//     attachments: []
//   });

//   const [loadingItems, setLoadingItems] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (open) {
//       api.get('/modules').then(res => setModules(res.data));
//     }
//   }, [open]);

//   useEffect(() => {
//     if (!form.moduleId) return;
//     setLoadingItems(true);
//     api.get(`/inventory?moduleName=${form.moduleId}`).then(res => {
//       setItems(res.data);
//       const groups = Array.from(new Set(res.data.map(i => i.group).filter(Boolean)));
//       setGroupList(groups);
//     }).finally(() => setLoadingItems(false));
//   }, [form.moduleId]);

//   const handleToggleSelect = (itemIds) => {
//     setForm(prev => {
//       const currentIds = new Set(prev.selectedItems.map(i => i.item));
//       const newSelected = [];

//       itemIds.forEach(id => {
//         if (!currentIds.has(id)) newSelected.push({ item: id, quantity: 1 });
//       });

//       const updated = [
//         ...prev.selectedItems.filter(i => !itemIds.includes(i.item)),
//         ...newSelected
//       ];

//       return { ...prev, selectedItems: updated };
//     });
//   };

//   const handleFileUpload = (e) => {
//     setForm(prev => ({ ...prev, attachments: Array.from(e.target.files) }));
//   };

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     const formData = new FormData();
//     formData.append('purpose', form.purpose);
//     formData.append('dateUsed', form.dateUsed);
//     formData.append('returnDate', form.returnDate);
//     formData.append('destination', form.destination);
//     formData.append('items', JSON.stringify(form.selectedItems));
//     form.attachments.forEach(file => formData.append('attachments', file));

//     try {
//       await api.post('/requests', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       console.error('Submit error:', err);
//       alert(err.response?.data?.message || 'Request failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const parents = items.filter(i => !i.parentItem);
//   const accessories = items.filter(i => i.parentItem);
//   const accessoriesByParent = accessories.reduce((acc, item) => {
//     const pid = item.parentItem;
//     if (!acc[pid]) acc[pid] = [];
//     acc[pid].push(item);
//     return acc;
//   }, {});

//   let displayItems = separateAccessories ? items : parents;

//   if (form.showAvailableOnly) {
//     const availableIds = new Set(items.filter(i => !i.checkedOut).map(i => i._id));
//     displayItems = displayItems.filter(i => availableIds.has(i._id));
//   }

//   if (form.group) {
//     displayItems = displayItems.filter(i => i.group === form.group);
//   }

//   if (searchTerm.trim()) {
//     const fuse = new Fuse(displayItems, {
//       keys: ['fields.Item Name'],
//       threshold: 0.3
//     });
//     displayItems = fuse.search(searchTerm).map(r => r.item);
//   }

//   const isSelected = (id) => form.selectedItems.some(i => i.item === id);
//   const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>New Equipment Request</DialogTitle>
//       <DialogContent dividers sx={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
//         <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
//           <TextField label="Purpose" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} fullWidth multiline />
//           <TextField label="Date Used" type="date" InputLabelProps={{ shrink: true }} value={form.dateUsed} onChange={e => setForm({ ...form, dateUsed: e.target.value })} fullWidth />
//           <TextField label="Return Date" type="date" InputLabelProps={{ shrink: true }} value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} fullWidth />
//           <TextField label="Destination" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} fullWidth />
//           <FormControl fullWidth>
//             <InputLabel>Module</InputLabel>
//             <Select value={form.moduleId} onChange={e => setForm({ ...form, moduleId: e.target.value, group: '', selectedItems: [] })}>
//               {modules.map(mod => <MenuItem key={mod._id} value={mod.route}>{mod.name}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Group</InputLabel>
//             <Select value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} disabled={!groupList.length}>
//               {groupList.map((group, i) => <MenuItem key={i} value={group}>{group}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormGroup>
//             <FormControlLabel control={<Switch checked={form.showAvailableOnly} onChange={e => setForm({ ...form, showAvailableOnly: e.target.checked })} />} label="Only Available" />
//             <FormControlLabel control={<Switch checked={separateAccessories} onChange={e => setSeparateAccessories(e.target.checked)} />} label="Separate Accessories" />
//           </FormGroup>
//         </Box>

//         <Box mt={2}>
//           <Box display="flex" alignItems="center" mb={1}>
//             <SearchIcon />
//             <TextField
//               placeholder="Search items..."
//               fullWidth
//               size="small"
//               onChange={e => setSearchTerm(e.target.value)}
//               sx={{ ml: 1 }}
//             />
//           </Box>

//           {loadingItems ? <CircularProgress /> : (
//             <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
//               {displayItems.map(item => {
//                 const id = item._id;
//                 const name = item.fields?.['Item Name'];
//                 const children = accessoriesByParent[id] || [];

//                 return (
//                   <Box key={id}>
//                     <Box display="flex" alignItems="center" justifyContent="space-between" py={1}>
//                       <Box display="flex" alignItems="center" gap={1}>
//                         {children.length > 0 && (
//                           <IconButton size="small" onClick={() => toggleExpand(id)}>
//                             {expanded[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                           </IconButton>
//                         )}
//                         <Typography sx={{ fontWeight: 500 }}>{name}</Typography>
//                       </Box>
//                       <Select
//                         size="small"
//                         value={form.selectedItems.filter(i => i.item === id || children.some(c => c._id === i.item)).length}
//                         onChange={e => handleToggleSelect([id, ...children.map(c => c._id)].slice(0, Number(e.target.value)))}
//                         sx={{ width: 80 }}
//                       >
//                         {[...Array(children.length + 2)].map((_, i) => (
//                           <MenuItem key={i} value={i}>{i}</MenuItem>
//                         ))}
//                       </Select>
//                     </Box>

//                     {children.length > 0 && (
//                       <Collapse in={expanded[id]}>
//                         <Box pl={4}>
//                           {children.map(acc => (
//                             <Typography key={acc._id} variant="body2">
//                               • {acc.fields?.['Item Name']} ({acc.fields?.Serial})
//                             </Typography>
//                           ))}
//                         </Box>
//                       </Collapse>
//                     )}
//                   </Box>
//                 );
//               })}
//             </Box>
//           )}
//         </Box>

//         <Box mt={3}>
//           <Typography>Attachments (optional)</Typography>
//           <input type="file" multiple onChange={handleFileUpload} />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit} disabled={submitting || !form.selectedItems.length}>
//           {submitting ? 'Submitting...' : 'Submit'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default NewRequestModal;



import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, InputLabel, FormControl,
  FormGroup, FormControlLabel, Switch, Button, Typography,
  Box, CircularProgress, Collapse, Checkbox, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Fuse from 'fuse.js';
import api from '../api';

const NewRequestModal = ({ open, onClose, onSuccess }) => {
  const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format (May 13, 2025)
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [separateAccessories, setSeparateAccessories] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [form, setForm] = useState({
    purpose: '',
    dateUsed: today,
    returnDate: '',
    destination: '',
    moduleId: '',
    group: '',
    showAvailableOnly: true,
    selectedItems: [], // Store item IDs as selected
    attachments: []
  });
  const [templates, setTemplates] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user')) || { _id: 'defaultUser' };

  useEffect(() => {
    if (open) {
      api.get('/modules').then(res => setModules(res.data));
      // Load user templates
      api.get(`/templates/user/${currentUser._id}`).then(res => setTemplates(res.data || []));
    }
  }, [open]);

  useEffect(() => {
    if (!form.moduleId) return;
    setLoadingItems(true);
    api.get(`/inventory?moduleName=${form.moduleId}`).then(res => {
      setItems(res.data);
      const groups = Array.from(new Set(res.data.map(i => i.group).filter(Boolean)));
      setGroupList(groups);
      if (form.dateUsed) {
        setForm(prev => ({
          ...prev,
          returnDate: new Date(new Date(form.dateUsed).setDate(new Date(form.dateUsed).getDate() + 7)).toISOString().split('T')[0]
        }));
      }
    }).finally(() => setLoadingItems(false));
  }, [form.moduleId, form.dateUsed]);

  const handleToggleSelect = (itemId) => {
    setForm(prev => {
      const isSelected = prev.selectedItems.includes(itemId);
      const updatedItems = isSelected
        ? prev.selectedItems.filter(id => id !== itemId)
        : [...prev.selectedItems, itemId];
      return { ...prev, selectedItems: updatedItems };
    });
  };

  const handleFileUpload = (e) => {
    setForm(prev => ({ ...prev, attachments: Array.from(e.target.files) }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('purpose', form.purpose);
    formData.append('dateUsed', form.dateUsed);
    formData.append('returnDate', form.returnDate);
    formData.append('destination', form.destination);
    formData.append('items', JSON.stringify(form.selectedItems.map(id => ({ item: id, quantity: 1 }))));
    form.attachments.forEach(file => formData.append('attachments', file));

    try {
      await api.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  // const handleSaveTemplate = async () => {
  //   const templateData = {
  //     userId: currentUser._id,
  //     purpose: form.purpose,
  //     destination: form.destination,
  //     selectedItems: form.selectedItems,
  //     moduleId: form.moduleId,
  //     group: form.group
  //   };
  //   await api.post('/templates', templateData);
  //   api.get(`/templates/user/${currentUser._id}`).then(res => setTemplates(res.data || []));
  // };

  const handleSaveTemplate = async () => {
    const templateData = {
      userId: currentUser._id,
      purpose: form.purpose,
      destination: form.destination,
      selectedItems: form.selectedItems,
      moduleId: form.moduleId,
      group: form.group
    };
    console.log('Saving template to:', '/templates', templateData);
  
    // Validate required fields
    if (!templateData.userId) {
      alert('User ID is missing. Please log in again.');
      return;
    }
    if (!templateData.purpose) {
      alert('Purpose is required to save a template.');
      return;
    }
  
    try {
      await api.post('/templates', templateData);
      const res = await api.get(`/templates/user/${currentUser._id}`);
      setTemplates(res.data || []);
      alert('Template saved successfully!');
    } catch (err) {
      console.error('Failed to save template, URL:', err.config.url, err);
      alert('Failed to save template: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLoadTemplate = (templateId) => {
    const template = templates.find(t => t._id === templateId);
    if (template) {
      setForm(prev => ({
        ...prev,
        purpose: template.purpose,
        destination: template.destination,
        selectedItems: template.selectedItems,
        moduleId: template.moduleId,
        group: template.group
      }));
    }
  };

  const parents = items.filter(i => !i.parentItem);
  const accessories = items.filter(i => i.parentItem);
  const accessoriesByParent = accessories.reduce((acc, item) => {
    const pid = item.parentItem;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(item);
    return acc;
  }, {});

  let displayItems = separateAccessories ? items : parents;

  if (form.showAvailableOnly) {
    const availableIds = new Set(items.filter(i => !i.checkedOut).map(i => i._id));
    displayItems = displayItems.filter(i => availableIds.has(i._id));
  }

  if (form.group) {
    displayItems = displayItems.filter(i => i.group === form.group);
  }

  if (searchTerm.trim()) {
    const fuse = new Fuse(displayItems, {
      keys: ['fields.Item Name'],
      threshold: 0.3
    });
    displayItems = fuse.search(searchTerm).map(r => r.item);
  }

  const isSelected = (id) => form.selectedItems.includes(id);
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New Equipment Request</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
          <TextField label="Purpose" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} fullWidth multiline />
          <TextField
            label="Date Used"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.dateUsed}
            onChange={e => setForm(prev => ({
              ...prev,
              dateUsed: e.target.value,
              returnDate: new Date(new Date(e.target.value).setDate(new Date(e.target.value).getDate() + 7)).toISOString().split('T')[0]
            }))}
            fullWidth
          />
          <TextField
            label="Return Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.returnDate}
            onChange={e => setForm({ ...form, returnDate: e.target.value })}
            fullWidth
          />
          <TextField label="Destination" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Module</InputLabel>
            <Select value={form.moduleId} onChange={e => setForm({ ...form, moduleId: e.target.value, group: '', selectedItems: [] })}>
              {modules.map(mod => <MenuItem key={mod._id} value={mod.route}>{mod.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Group</InputLabel>
            <Select value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} disabled={!groupList.length}>
              {groupList.map((group, i) => <MenuItem key={i} value={group}>{group}</MenuItem>)}
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel control={<Switch checked={form.showAvailableOnly} onChange={e => setForm({ ...form, showAvailableOnly: e.target.checked })} />} label="Only Available" />
            <FormControlLabel control={<Switch checked={separateAccessories} onChange={e => setSeparateAccessories(e.target.checked)} />} label="Separate Accessories" />
          </FormGroup>
        </Box>

        <Box mt={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <SearchIcon />
            <TextField
              placeholder="Search items..."
              fullWidth
              size="small"
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ ml: 1 }}
            />
          </Box>

          {loadingItems ? <CircularProgress /> : (
            <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
              {displayItems.map(item => {
                const id = item._id;
                const name = item.fields?.['Item Name'];
                const children = accessoriesByParent[id] || [];

                return (
                  <Box key={id}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" py={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {children.length > 0 && (
                          <IconButton size="small" onClick={() => toggleExpand(id)}>
                            {expanded[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                        <FormControlLabel
                          control={<Checkbox checked={isSelected(id)} onChange={() => handleToggleSelect(id)} />}
                          label={<Typography sx={{ fontWeight: 500 }}>{name}</Typography>}
                        />
                      </Box>
                    </Box>

                    {children.length > 0 && (
                      <Collapse in={expanded[id]}>
                        <Box pl={4}>
                          {children.map(acc => (
                            <FormControlLabel
                              key={acc._id}
                              control={<Checkbox checked={isSelected(acc._id)} onChange={() => handleToggleSelect(acc._id)} />}
                              label={<Typography variant="body2">• {acc.fields?.['Item Name']} ({acc.fields?.Serial})</Typography>}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Box mt={2}>
          <Typography>Load Template</Typography>
          <Select value="" onChange={e => handleLoadTemplate(e.target.value)} fullWidth size="small" displayEmpty>
            <MenuItem value="" disabled>Select a template</MenuItem>
            {templates.map(template => (
              <MenuItem key={template._id} value={template._id}>{template.purpose || 'Untitled Template'}</MenuItem>
            ))}
          </Select>
        </Box>

        <Box mt={3}>
          <Typography>Attachments (optional)</Typography>
          <input type="file" multiple onChange={handleFileUpload} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="outlined" onClick={handleSaveTemplate} disabled={!form.selectedItems.length}>Save as Template</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !form.selectedItems.length}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewRequestModal;