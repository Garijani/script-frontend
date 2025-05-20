// // import React, { useEffect, useState } from 'react';
// // import {
// //   Box,
// //   Drawer,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Divider,
// //   Toolbar,
// //   Typography,
// // } from '@mui/material';
// // import { useNavigate, useLocation, useParams } from 'react-router-dom';
// // import api from '../api';


// // const drawerWidth = 200;

// // const projectNavItems = [
// //   { label: 'Overview', path: '' },
// //   { label: 'Scripts', path: 'scripts' },
// //   { label: 'Breakdown', path: 'breakdown' },
// //   { label: 'Tasks', path: 'tasks' },
// //   { label: 'Wardrobe', path: 'wardrobe' },
// //   { label: 'Gear', path: 'equipment' },
// //   { label: 'Team', path: 'team' },
// // ];

// // export default function SidebarLayout() {
// //   const [categories, setCategories] = useState([]);
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { projectId } = useParams();

// //   // ✅ Highlights exact path
// //   const isActive = (path) => location.pathname === path;

// //   // ✅ Highlights starts-with paths (e.g. /project/...)
// //   const isProjectRoute = location.pathname.startsWith('/project/');

// //   // ✅ Fetch categories using token-authenticated request
// //   useEffect(() => {
// //     api.get('/categories')
// //       .then(res => {
// //         setCategories(Array.isArray(res.data) ? res.data : []);
// //       })
// //       .catch(err => {
// //         console.error('Failed to fetch categories:', err);
// //         setCategories([]);
// //       });
// //   }, []);

// //   return (
// //     <Drawer
// //       variant="permanent"
// //       sx={{
// //         width: drawerWidth,
// //         flexShrink: 0,
// //         '& .MuiDrawer-paper': {
// //           width: drawerWidth,
// //           boxSizing: 'border-box',
// //           bgcolor: (theme) => theme.palette.background.paper,
// //         },
// //       }}
// //     >
// //       <Toolbar />
// //       <List>
// //         <ListItem
// //           button
// //           onClick={() => navigate('/')}
// //           selected={isActive('/')}
// //         >
// //           <ListItemText primary="🏠 Home" />
// //         </ListItem>

// //         <Divider />

// //         {categories.map(cat => (
// //           <ListItem
// //             key={cat._id}
// //             button
// //             onClick={() => navigate(`/category/${cat._id}`)}
// //             selected={isActive(`/category/${cat._id}`)}
// //           >
// //             <ListItemText primary={`📁 ${cat.name}`} />
// //           </ListItem>
// //         ))}
// //       </List>

// //       {isProjectRoute && (
// //         <>
// //           <Divider sx={{ my: 1 }} />
// //           <Typography variant="caption" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
// //             Project Sections
// //           </Typography>
// //           <List>
// //             {projectNavItems.map(item => (
// //               <ListItem
// //                 key={item.label}
// //                 button
// //                 onClick={() => navigate(`/project/${projectId}/${item.path}`)}
// //                 selected={location.pathname.endsWith(item.path)}
// //               >
// //                 <ListItemText primary={item.label} />
// //               </ListItem>
// //             ))}
// //           </List>
// //         </>
// //       )}
// //     </Drawer>
// //   );
// // }


// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Toolbar,
//   Typography,
// } from '@mui/material';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import api from '../api';

// const drawerWidth = 200;

// const projectNavItems = [
//   { label: 'Overview', path: '' },
//   { label: 'Scripts', path: 'scripts' },
//   { label: 'Breakdown', path: 'breakdown' },
//   { label: 'Tasks', path: 'tasks' },
//   { label: 'Wardrobe', path: 'wardrobe' },
//   { label: 'Gear', path: 'equipment' },
//   { label: 'Team', path: 'team' },
// ];

// export default function SidebarLayout() {
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { projectId } = useParams();

//   const user = JSON.parse(localStorage.getItem('user')); // ✅ get logged-in user

//   // ✅ Highlights exact path
//   const isActive = (path) => location.pathname === path;

//   // ✅ Highlights starts-with paths (e.g. /project/...)
//   const isProjectRoute = location.pathname.startsWith('/project/');

//   // ✅ Fetch categories using token-authenticated request
//   useEffect(() => {
//     api.get('/categories')
//       .then(res => {
//         setCategories(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(err => {
//         console.error('Failed to fetch categories:', err);
//         setCategories([]);
//       });
//   }, []);

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           bgcolor: (theme) => theme.palette.background.paper,
//         },
//       }}
//     >
//       <Toolbar />
//       <List>
//         <ListItem
//           button
//           onClick={() => navigate('/')}
//           selected={isActive('/')}
//         >
//           <ListItemText primary="🏠 Home" />
//         </ListItem>

//         <Divider />

//         {categories.map(cat => (
//           <ListItem
//             key={cat._id}
//             button
//             onClick={() => navigate(`/category/${cat._id}`)}
//             selected={isActive(`/category/${cat._id}`)}
//           >
//             <ListItemText primary={`📁 ${cat.name}`} />
//           </ListItem>
//         ))}
//       </List>

//       {user?.role === 'Admin' && (
//         <>
//           <Divider sx={{ my: 1 }} />
//           <List>
//             <ListItem
//               button
//               onClick={() => navigate('/users')}
//               selected={isActive('/users')}
//             >
//               <ListItemText primary="👥 Manage Users" />
//             </ListItem>
//           </List>
//         </>
//       )}

//       {isProjectRoute && (
//         <>
//           <Divider sx={{ my: 1 }} />
//           <Typography variant="caption" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
//             Project Sections
//           </Typography>
//           <List>
//             {projectNavItems.map(item => (
//               <ListItem
//                 key={item.label}
//                 button
//                 onClick={() => navigate(`/project/${projectId}/${item.path}`)}
//                 selected={location.pathname.endsWith(item.path)}
//               >
//                 <ListItemText primary={item.label} />
//               </ListItem>
//             ))}
//           </List>
//         </>
//       )}
//     </Drawer>
//   );
// }


import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api';

const drawerWidth = 200;

const projectNavItems = [
  { label: 'Overview', path: '' },
  { label: 'Scripts', path: 'scripts' },
  { label: 'Breakdown', path: 'breakdown' },
  { label: 'Tasks', path: 'tasks' },
  { label: 'Wardrobe', path: 'wardrobe' },
  { label: 'Gear', path: 'equipment' },
  { label: 'Team', path: 'team' },
];

export default function SidebarLayout() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();

  const user = JSON.parse(localStorage.getItem('user')); // ✅ get logged-in user

  // ✅ Highlights exact path
  const isActive = (path) => location.pathname === path;

  // ✅ Highlights starts-with paths (e.g. /project/...)
  const isProjectRoute = location.pathname.startsWith('/project/');

  // ✅ Fetch categories using token-authenticated request
  useEffect(() => {
    api.get('/categories')
      .then(res => {
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      });
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: (theme) => theme.palette.background.paper,
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem
          button
          onClick={() => navigate('/')}
          selected={isActive('/')}
        >
          <ListItemText primary="🏠 Home" />
        </ListItem>

        <Divider />

        {categories.map(cat => (
          <ListItem
            key={cat._id}
            button
            onClick={() => navigate(`/category/${cat._id}`)}
            selected={isActive(`/category/${cat._id}`)}
          >
            <ListItemText primary={`📁 ${cat.name}`} />
          </ListItem>
        ))}
      </List>

      {user?.role === 'Admin' && (
        <>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem
              button
              onClick={() => navigate('/users')}
              selected={isActive('/users')}
            >
              <ListItemText primary="👥 Manage Users" />
            </ListItem>
          </List>
        </>
      )}

      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
        Resources
      </Typography>
      <List>
        <ListItem
          button
          onClick={() => navigate('/requests/new')}
          selected={isActive('/requests/new')}
        >
          <ListItemText primary="📅 Book Item" />
        </ListItem>
      </List>

      <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
          ClickUp System
        </Typography>
        <List>
          <ListItem
            button
            onClick={() => navigate('/clickup/workspaces')}
            selected={location.pathname.startsWith('/clickup')}
          >
            <ListItemText primary="🗂 Workspaces" />
          </ListItem>
        </List>


      {isProjectRoute && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
            Project Sections
          </Typography>
          <List>
            {projectNavItems.map(item => (
              <ListItem
                key={item.label}
                button
                onClick={() => navigate(`/project/${projectId}/${item.path}`)}
                selected={location.pathname.endsWith(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
}