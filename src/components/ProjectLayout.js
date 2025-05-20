// // import React from 'react';
// // import { Outlet, useNavigate, useParams } from 'react-router-dom';
// // import {
// //   Box,
// //   Drawer,
// //   List,
// //   ListItemButton,
// //   ListItemText,
// //   IconButton,
// //   Typography,
// //   AppBar,
// //   Toolbar
// // } from '@mui/material';
// // import MenuIcon from '@mui/icons-material/Menu';

// // const navItems = [
// //   { label: 'Overview', path: '' },
// //   { label: 'Scripts', path: 'scripts' },
// //   { label: 'Breakdown', path: 'breakdown' },
// //   { label: 'Tasks', path: 'tasks' },
// //   { label: 'Wardrobe', path: 'wardrobe' },
// //   { label: 'Gear', path: 'equipment' },
// //   { label: 'Team', path: 'team' },
// // ];

// // export default function ProjectLayout() {
// //   const { projectId } = useParams();
// //   const navigate = useNavigate();
// //   const [open, setOpen] = React.useState(true);

// //   const toggleDrawer = () => {
// //     setOpen(!open);
// //   };

// //   const handleNav = (path) => {
// //     navigate(`/project/${projectId}/${path}`);
// //   };

// //   return (
// //     <Box display="flex">
// //       {/* Sidebar */}
// //       <Drawer variant="persistent" anchor="left" open={open}>
// //         <Box width={240} role="presentation">
// //           <List>
// //             {navItems.map(item => (
// //               <ListItemButton key={item.label} onClick={() => handleNav(item.path)}>
// //                 <ListItemText primary={item.label} />
// //               </ListItemButton>
// //             ))}
// //           </List>
// //         </Box>
// //       </Drawer>

// //       {/* Main Content */}
// //       <Box component="main" flexGrow={1}>
// //         <AppBar position="sticky" color="default" sx={{ ml: open ? 30 : 0 }}>
// //           <Toolbar>
// //             <IconButton edge="start" onClick={toggleDrawer}>
// //               <MenuIcon />
// //             </IconButton>
// //             <Typography variant="h6" component="div">
// //               Project Dashboard
// //             </Typography>
// //           </Toolbar>
// //         </AppBar>
// //         <Box p={3}>
// //           <Outlet />
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // }


// // import React from 'react';
// // import { Outlet, useNavigate, useParams } from 'react-router-dom';
// // import {
// //   Box,
// //   Drawer,
// //   List,
// //   ListItemButton,
// //   ListItemText,
// // } from '@mui/material';

// // const navItems = [
// //   { label: 'Overview', path: '' },
// //   { label: 'Scripts', path: 'scripts' },
// //   { label: 'Breakdown', path: 'breakdown' },
// //   { label: 'Tasks', path: 'tasks' },
// //   { label: 'Wardrobe', path: 'wardrobe' },
// //   { label: 'Gear', path: 'equipment' },
// //   { label: 'Team', path: 'team' },
// // ];

// // export default function ProjectLayout() {
// //   const { projectId } = useParams();
// //   const navigate = useNavigate();
// //   const [open, setOpen] = React.useState(true);

// //   const handleNav = (path) => {
// //     navigate(`/project/${projectId}/${path}`);
// //   };

// //   return (
// //     <Box display="flex">
// //       {/* Sidebar for inner project navigation */}
// //       <Drawer variant="persistent" anchor="left" open={open}>
// //         <Box width={240} role="presentation">
// //           <List>
// //             {navItems.map((item) => (
// //               <ListItemButton key={item.label} onClick={() => handleNav(item.path)}>
// //                 <ListItemText primary={item.label} />
// //               </ListItemButton>
// //             ))}
// //           </List>
// //         </Box>
// //       </Drawer>

// //       {/* Main Content Area */}
// //       <Box component="main" flexGrow={1}>
// //         <Box p={3}>
// //           <Outlet />
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // }


// import React from 'react';
// import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   Toolbar,
//   Divider,
// } from '@mui/material';

// const drawerWidth = 100;

// const navItems = [
//   { label: 'Overview', path: '' },
//   { label: 'Scripts', path: 'scripts' },
//   { label: 'Breakdown', path: 'breakdown' },
//   { label: 'Tasks', path: 'tasks' },
//   { label: 'Wardrobe', path: 'wardrobe' },
//   { label: 'Gear', path: 'equipment' },
//   { label: 'Team', path: 'team' },
// ];

// export default function ProjectLayout() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleNav = (path) => {
//     navigate(`/project/${projectId}/${path}`);
//   };

//   const getActivePath = () => {
//     const subPath = location.pathname.split(`/project/${projectId}/`)[1] || '';
//     return subPath;
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       {/* Sidebar below Topbar */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//             mt: '64px', // aligns drawer under the topbar
//           },
//         }}
//       >
//         <Toolbar />
//         <Divider />
//         <List>
//           {navItems.map((item) => (
//             <ListItemButton
//               key={item.label}
//               onClick={() => handleNav(item.path)}
//               selected={getActivePath() === item.path}
//             >
//               <ListItemText primary={item.label} />
//             </ListItemButton>
//           ))}
//         </List>
//       </Drawer>

//       {/* Main Content Area */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           ml: `${drawerWidth}px`, // prevents overlap with sidebar
//         }}
//       >
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }


// // frontend/src/components/ProjectLayout.js

// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { Box } from '@mui/material';

// export default function ProjectLayout() {
//   return (
//     <Box sx={{ p: 3 }}>
//       <Outlet />
//     </Box>
//   );
// }

// // frontend/src/components/ProjectLayout.js
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function ProjectLayout() {
  return (
    <Box sx={{ flexGrow: 1, px: 3, py: 4 }}>
      <Outlet />
    </Box>
  );
}
