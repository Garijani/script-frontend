// // import React, { useEffect, useState } from 'react';
// // import TopNavTabs from './TopNavTabs';
// // import OverviewGrid from './OverviewGrid';
// // import TeamPage from './TeamPage';
// // import api from '../../api';

// // export default function WorkspacePage() {
// //   const [workspaces, setWorkspaces] = useState([]);
// //   const [activeTab, setActiveTab] = useState('Overview');
// //   const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

// //   useEffect(() => {
// //     fetchWorkspaces();
// //   }, []);

// //   const fetchWorkspaces = () => {
// //     api.get('/workspaces')
// //       .then(res => setWorkspaces(res.data))
// //       .catch(err => console.error('Error fetching workspaces:', err));
// //   };

// //   return (
// //     <div className="p-6 text-white">
// //       <h1 className="text-3xl font-bold mb-4">Workspaces</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //         {workspaces.map(ws => (
// //           <div
// //             key={ws._id}
// //             className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700"
// //           >
// //             <h2 className="text-lg font-semibold">{ws.name}</h2>
// //             <p className="text-sm text-gray-400 mt-1">Created by: {ws.createdBy}</p>
// //             <button
// //               className="mt-2 bg-blue-600 px-3 py-1 rounded text-sm"
// //               onClick={() => setSelectedWorkspaceId(ws._id)}
// //             >
// //               Open
// //             </button>
// //           </div>
// //         ))}
// //       </div>

// //       {selectedWorkspaceId && (
// //         <>
// //           <TopNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
// //           <div className="mt-4">
// //             {activeTab === 'Overview' && <OverviewGrid />}
// //             {activeTab === 'List' && <div className="text-gray-400">List View Coming Soon...</div>}
// //             {activeTab === 'Board' && <div className="text-gray-400">Board View Coming Soon...</div>}
// //           </div>

// //           <div className="mt-10">
// //             <TeamPage workspaceId={selectedWorkspaceId} />
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }



// import React, { useEffect, useState } from 'react';
// import api from '../../api';

// export default function WorkspacePage() {
//   const [workspaces, setWorkspaces] = useState([]);
//   const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

//   useEffect(() => {
//     fetchWorkspaces();
//   }, []);

//   const fetchWorkspaces = () => {
//     api.get('/workspaces')
//       .then(res => setWorkspaces(res.data))
//       .catch(err => console.error('Error fetching workspaces:', err));
//   };

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-3xl font-bold mb-4">Workspaces</h1>

//       {!selectedWorkspaceId ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {workspaces.map(ws => (
//             <div
//               key={ws._id}
//               className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700"
//             >
//               <h2 className="text-lg font-semibold">{ws.name}</h2>
//               <p className="text-sm text-gray-400 mt-1">Created by: {ws.createdBy}</p>
//               <button
//                 className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
//                 onClick={() => setSelectedWorkspaceId(ws._id)}
//               >
//                 Open
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center mt-10">
//           <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
//             🚧 This workspace page is still in progress
//           </h2>
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//             onClick={() => setSelectedWorkspaceId(null)}
//           >
//             Back to Home
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = () => {
    setLoading(true);
    api.get('/workspaces')
      .then(res => setWorkspaces(res.data))
      .catch(err => {
        console.error('Error fetching workspaces:', err);
        setWorkspaces([]); // fallback to empty
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Workspaces</h1>

      {loading ? (
        <p className="text-gray-400">Loading workspaces...</p>
      ) : !selectedWorkspaceId ? (
        workspaces.length === 0 ? (
          <p className="text-gray-400">No workspaces found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {workspaces.map(ws => (
              <div
                key={ws._id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700"
              >
                <h2 className="text-lg font-semibold">{ws.name}</h2>
                <p className="text-sm text-gray-400 mt-1">Created by: {ws.createdBy}</p>
                <button
                  className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                  onClick={() => setSelectedWorkspaceId(ws._id)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            🚧 This workspace page is still in progress
          </h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setSelectedWorkspaceId(null)}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
