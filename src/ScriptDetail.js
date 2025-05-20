// // frontend/src/ScriptDetail.js
// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";

// const ScriptDetail = () => {
//   const { id } = useParams(); // Extract the script ID from the URL
//   const [script, setScript] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch the script details using the provided ID
//     fetch(`http://localhost:3000/scripts/${id}`, {
//       method: "GET",
//       headers: {
//         username: "admin",
//         password: "admin"
//       }
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch script details");
//         }
//         return response.json();
//       })
//       .then(data => {
//         setScript(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <p>Loading script details...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!script) return <p>No script found.</p>;

//   return (
//     <div>
//       <h2>Script Details: {script.title}</h2>
//       <p>
//         <strong>Shooting Date:</strong>{" "}
//         {script.shootingDate
//           ? new Date(script.shootingDate).toLocaleDateString()
//           : "-"}
//       </p>
//       <p>
//         <strong>Uploaded At:</strong>{" "}
//         {new Date(script.uploadedAt).toLocaleDateString()}
//       </p>
//       <h3>Drafts</h3>
//       {script.drafts.map((draft, index) => (
//         <div key={index} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
//           <p>
//             <strong>Original File:</strong> {draft.originalName}
//           </p>
//           <p>
//             <strong>Uploaded At:</strong>{" "}
//             {new Date(draft.uploadedAt).toLocaleDateString()}
//           </p>
//           <h4>Breakdown</h4>
//           <table border="1" cellPadding="5" cellSpacing="0">
//             <thead>
//               <tr>
//                 <th>Scene Number</th>
//                 <th>Location</th>
//                 <th>INT/EXT</th>
//                 <th>Time</th>
//                 <th>Set</th>
//                 <th>Characters</th>
//                 <th>Action Summary</th>
//               </tr>
//             </thead>
//             <tbody>
//               {draft.breakdown.map((scene, i) => (
//                 <tr key={i}>
//                   <td>{scene.sceneNumber}</td>
//                   <td>{scene.location}</td>
//                   <td>{scene.intExt}</td>
//                   <td>{scene.time}</td>
//                   <td>{scene.set}</td>
//                   <td>{scene.characters}</td>
//                   <td>{scene.actionSummary}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//       <Link to="/">← Back to Dashboard</Link>
//     </div>
//   );
// };

// export default ScriptDetail;

// frontend/src/ScriptDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "./api"; // ✅ Use secured API instance

const ScriptDetail = () => {
  const { id } = useParams(); // Extract the script ID from the URL
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const { data } = await api.get(`/scripts/${id}`); // ✅ Secure call with token
        setScript(data);
      } catch (err) {
        console.error("Failed to fetch script:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [id]);

  if (loading) return <p>Loading script details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!script) return <p>No script found.</p>;

  return (
    <div>
      <h2>Script Details: {script.title}</h2>
      <p>
        <strong>Shooting Date:</strong>{" "}
        {script.shootingDate
          ? new Date(script.shootingDate).toLocaleDateString()
          : "-"}
      </p>
      <p>
        <strong>Uploaded At:</strong>{" "}
        {new Date(script.uploadedAt).toLocaleDateString()}
      </p>

      <h3>Drafts</h3>
      {script.drafts.map((draft, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
          }}
        >
          <p>
            <strong>Original File:</strong> {draft.originalName}
          </p>
          <p>
            <strong>Uploaded At:</strong>{" "}
            {new Date(draft.uploadedAt).toLocaleDateString()}
          </p>
          <h4>Breakdown</h4>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Scene Number</th>
                <th>Location</th>
                <th>INT/EXT</th>
                <th>Time</th>
                <th>Set</th>
                <th>Characters</th>
                <th>Action Summary</th>
              </tr>
            </thead>
            <tbody>
              {draft.breakdown.map((scene, i) => (
                <tr key={i}>
                  <td>{scene.sceneNumber}</td>
                  <td>{scene.location}</td>
                  <td>{scene.intExt}</td>
                  <td>{scene.time}</td>
                  <td>{scene.set}</td>
                  <td>{scene.characters}</td>
                  <td>{scene.actionSummary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <Link to="/">← Back to Dashboard</Link>
    </div>
  );
};

export default ScriptDetail;
