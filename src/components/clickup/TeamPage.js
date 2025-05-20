// // TeamPage.js
// import React, { useEffect, useState } from 'react';
// import { Button, Card, CardContent, Typography, Avatar, Grid, IconButton } from '@mui/material';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import InviteUserModal from './InviteUserModal';
// import api from '../../api';

// const TeamPage = ({ workspaceId }) => {
//   const [members, setMembers] = useState([]);
//   const [openInviteModal, setOpenInviteModal] = useState(false);

//   const fetchMembers = async () => {
//     try {
//       const res = await api.get(`/workspaces`);
//       const currentWorkspace = res.data.find(ws => ws._id === workspaceId);
//       if (currentWorkspace) setMembers(currentWorkspace.members);
//     } catch (err) {
//       console.error('Error fetching members:', err);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Team Members</h2>
//         <Button
//           variant="contained"
//           startIcon={<PersonAddIcon />}
//           onClick={() => setOpenInviteModal(true)}
//         >
//           Invite Member
//         </Button>
//       </div>

//       <Grid container spacing={2}>
//         {members.map(({ user, role }) => (
//           <Grid item xs={12} sm={6} md={4} key={user._id}>
//             <Card className="shadow-md">
//               <CardContent>
//                 <div className="flex items-center gap-4">
//                   <Avatar>{user.name?.charAt(0)}</Avatar>
//                   <div>
//                     <Typography variant="subtitle1">{user.name}</Typography>
//                     <Typography variant="body2" color="textSecondary">{user.email}</Typography>
//                     <Typography variant="caption" className="text-blue-600">{role?.name}</Typography>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <InviteUserModal
//         open={openInviteModal}
//         onClose={() => setOpenInviteModal(false)}
//         onInvited={fetchMembers}
//         workspaceId={workspaceId}
//       />
//     </div>
//   );
// };

// export default TeamPage;


// src/components/clickup/TeamPage.js
import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardContent, Typography, Avatar, Grid
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InviteUserModal from './InviteUserModal';
import api from '../../api';

const TeamPage = ({ workspaceId }) => {
  const [members, setMembers] = useState([]);
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/workspaces`);
      const currentWorkspace = res.data.find(ws => ws._id === workspaceId);
      if (currentWorkspace) setMembers(currentWorkspace.members);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-6 mt-12 border-t border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Team Members</h2>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setOpenInviteModal(true)}
        >
          Invite Member
        </Button>
      </div>

      <Grid container spacing={3}>
        {members.map(({ user, role }) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card className="bg-gray-900 text-white rounded-xl shadow-md hover:shadow-lg transition">
              <CardContent className="flex items-center gap-4">
                <Avatar sx={{ bgcolor: '#444' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Typography variant="subtitle1" className="text-white">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    {user.email}
                  </Typography>
                  <Typography variant="caption" className="text-purple-400 font-medium">
                    {role?.name}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <InviteUserModal
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        onInvited={fetchMembers}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default TeamPage;
