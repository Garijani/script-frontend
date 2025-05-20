// import React, { useEffect, useState } from 'react';
// import {
//   Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Snackbar
// } from '@mui/material';
// import api from '../api';

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [snackbar, setSnackbar] = useState('');

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await api.get('/users', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error('Failed to fetch users:', err.response?.data || err.message);
//     }
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     try {
//       const token = localStorage.getItem('token');
//       await api.put(`/users/${userId}/role`, { role: newRole }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSnackbar('User role updated successfully');
//       fetchUsers();
//     } catch (err) {
//       console.error('Error updating role:', err.response?.data || err.message);
//       setSnackbar('Failed to update role');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <Box p={4}>
//       <Typography variant="h5" mb={2}>User Management</Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Email</TableCell>
//             <TableCell>Current Role</TableCell>
//             <TableCell>Change Role</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {users.map((user) => (
//             <TableRow key={user._id}>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.role?.name}</TableCell>
//               <TableCell>
//                 <Select
//                   value={user.role?.name || ''}
//                   onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                   size="small"
//                 >
//                   <MenuItem value="Admin">Admin</MenuItem>
//                   <MenuItem value="User">User</MenuItem>
//                   <MenuItem value="Executive Producer">Executive Producer</MenuItem>
//                 </Select>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Snackbar
//         open={!!snackbar}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar('')}
//         message={snackbar}
//       />
//     </Box>
//   );
// }


import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Select, MenuItem, Snackbar, Paper
} from '@mui/material';
import AddUserModal from './AddUserModal';
import { Button } from '@mui/material'; // if not already imported

import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [snackbar, setSnackbar] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);


  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    const res = await api.get('/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  const fetchRoles = async () => {
    const res = await api.get('/users/roles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRoles(res.data);
  };

  const handleRoleChange = async (userId, newRole) => {
    await api.put(`/users/${userId}/role`, { role: newRole }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSnackbar('Role updated');
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>👥 User Management</Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" onClick={() => setShowAddModal(true)}>
                ➕ Add New User
            </Button>
        </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>


        <Table>
        <TableHead sx={{ backgroundColor: 'background.default' }}>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Current Role</TableCell>
                <TableCell>Change Role</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user._id}>
                <TableCell>{user.name || '-'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role?.name || '-'}</TableCell>
                <TableCell>
                    <Select
                    size="small"
                    value={user.role?.name || ''}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    sx={{ minWidth: 160 }}
                    >
                    {roles.map((r) => (
                        <MenuItem key={r._id} value={r.name}>
                        {r.name}
                        </MenuItem>
                    ))}
                    </Select>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

        </Table>
      </Paper>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />

        <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={fetchUsers}
        />


    </Box>
  );
}
