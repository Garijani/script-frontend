// import React, { useEffect, useState, useContext } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Avatar,
//   Switch,
//   Tooltip,
//   Stack,
//   TextField,
//   CssBaseline,
//   Button,
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// import SidebarLayout from './SidebarLayout';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ColorModeContext } from '../App';

// const drawerWidth = 200;

// export default function GlobalLayout({ children }) {
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [dynamicTitle, setDynamicTitle] = useState('Movie Breakdown App');

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // Update the title based on route
//   useEffect(() => {
//     if (location.pathname === '/') {
//       setDynamicTitle('🏠 Home');
//     } else if (location.pathname.includes('/category')) {
//       setDynamicTitle('📁 Category');
//     } else if (location.pathname.includes('/project')) {
//       setDynamicTitle('📂 Project');
//     } else if (location.pathname.includes('/breakdown')) {
//       setDynamicTitle('📄 Scene Breakdown');
//     } else if (location.pathname.includes('/comparison')) {
//       setDynamicTitle('🪞 Draft Comparison');
//     } else {
//       setDynamicTitle('Movie Breakdown App');
//     }
//   }, [location.pathname]);

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />

//       {/* Top Bar */}
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           zIndex: theme.zIndex.drawer + 1,
//           borderBottom: `1px solid ${theme.palette.divider}`,
//           backgroundColor: theme.palette.background.paper,
//         }}
//       >
//         <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
//           <Typography variant="h6" fontWeight="bold" noWrap>
//             {dynamicTitle}
//           </Typography>

//           <Stack direction="row" spacing={2} alignItems="center">
//             <TextField
//               size="small"
//               placeholder="Search…"
//               variant="outlined"
//               sx={{ width: 200 }}
//             />

//             {/* Dark Mode Toggle */}
//             <Tooltip title="Toggle Light/Dark Mode">
//               <Switch
//                 size="small"
//                 checked={theme.palette.mode === 'dark'}
//                 onChange={colorMode.toggleColorMode}
//               />
//             </Tooltip>

//             {/* Notifications */}
//             <Tooltip title="Notifications">
//               <IconButton>
//                 <NotificationsNoneIcon />
//               </IconButton>
//             </Tooltip>

//             {/* Avatar */}
//             {/* <Tooltip title="Account">
//               <IconButton>
//                 <Avatar alt="User">D</Avatar>
//               </IconButton>
//             </Tooltip> */}

//             <Tooltip title="My Profile">
//               <IconButton onClick={() => navigate('/profile')}>
//                 <Avatar alt="User">
//                   {JSON.parse(localStorage.getItem('user'))?.name?.charAt(0) || 'U'}
//                 </Avatar>
//               </IconButton>
//             </Tooltip>


//             {/* Logout Button */}
//             <Button variant="outlined" color="error" onClick={handleLogout}>
//               Logout
//             </Button>
//           </Stack>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <SidebarLayout />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           px: 3,
//           pt: 0,
//           pb: 3,
//           mt: '64px',  // offset for AppBar height
//           width: `calc(100% - ${drawerWidth}px)`,
//           backgroundColor: theme.palette.background.default,
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// }


import React, { useEffect, useState, useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Avatar, Switch, Tooltip,
  Stack, TextField, CssBaseline, Button, Badge, Popover, List, ListItemButton, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SidebarLayout from './SidebarLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../App';
import api from '../api';

const drawerWidth = 200;

export default function GlobalLayout({ children }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [dynamicTitle, setDynamicTitle] = useState('Movie Breakdown App');
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');


  const unreadCount = notifications.filter(n => !n.read).length;
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    api.get('/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setNotifications(res.data));
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (location.pathname === '/') {
      setDynamicTitle('🏠 Home');
    } else if (location.pathname.includes('/category')) {
      setDynamicTitle('📁 Category');
    } else if (location.pathname.includes('/project')) {
      setDynamicTitle('📂 Project');
    } else if (location.pathname.includes('/breakdown')) {
      setDynamicTitle('📄 Scene Breakdown');
    } else if (location.pathname.includes('/comparison')) {
      setDynamicTitle('🪞 Draft Comparison');
    } else {
      setDynamicTitle('Movie Breakdown App');
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {dynamicTitle}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* <TextField
              size="small"
              placeholder="Search…"
              variant="outlined"
              sx={{ width: 200 }}
            /> */}
            
            {/* <TextField
              size="small"
              placeholder="Search…"
              variant="outlined"
              sx={{ width: 200 }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                window.dispatchEvent(new CustomEvent('globalSearch', {
                  detail: e.target.value
                }));
              }}
            /> */}

            <Tooltip title="Toggle Light/Dark Mode">
              <Switch
                size="small"
                checked={theme.palette.mode === 'dark'}
                onChange={colorMode.toggleColorMode}
              />
            </Tooltip>

            {/* 🔔 Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="My Profile">
              <IconButton onClick={() => navigate('/profile')}>
                <Avatar alt="User">
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 1, minWidth: 250 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>🔔 Notifications</Typography>
          <List dense>
            {notifications.length === 0 ? (
              <ListItemText primary="No notifications" sx={{ px: 2 }} />
            ) : (
              notifications.map(n => (
                <ListItemButton
                  key={n._id}
                  onClick={() => {
                    window.location.href = n.link;
                    setAnchorEl(null);
                  }}
                  sx={{ backgroundColor: !n.read ? 'action.hover' : 'inherit' }}
                >
                  <ListItemText primary={n.message} />
                </ListItemButton>
              ))
            )}
          </List>
        </Box>
      </Popover>

      <SidebarLayout />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          pt: 0,
          pb: 3,
          mt: '64px',
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
