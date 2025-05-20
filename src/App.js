//src/App.js

import React, { useState, useMemo, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import GlobalLayout from './components/GlobalLayout';
import HomeDashboard from './HomeDashboard';
import CategoryDashboard from './CategoryDashboard';
import UploadModal from './UploadModal';
import ModalView from './ModalView';
import FullBreakdown from './FullBreakdown';
import DraftComparison from './DraftComparison';
import ProjectLayout from './components/ProjectLayout';
import ProjectDashboard from './ProjectDashboard';
import GlobalModulePage from './GlobalModulePage';
import DynamicModulePage from './DynamicModulePage';
import Login from './components/Login';
import RequestPage from './components/RequestPage';
import PendingRequestsPage from './components/PendingRequestsPage';
import CheckOutPage from './components/CheckOutPage';
import CheckOutScanner from './components/CheckOutScanner';
import CheckInScanner from './components/CheckInScanner';
import RequestScanner from './components/RequestScanner';
import Users from './components/Users';
import Profile from './components/Profile';
import Register from './components/Register';

import SidebarClickup from './components/clickup/SidebarClickup';
import WorkspacePage from './components/clickup/WorkspacePage';
import SpacePage from './components/clickup/SpacePage';
import FolderPage from './components/clickup/FolderPage';
import ListPage from './components/clickup/ListPage';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const getInitialMode = () => {
    const saved = localStorage.getItem('colorMode');
    return saved === 'dark' ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode(prev => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('colorMode', next);
        return next;
      });
    }
  }), []);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Only */}
            <Route
              path="/users"
              element={
                JSON.parse(localStorage.getItem('user'))?.role === 'Admin' ? (
                  <GlobalLayout title="Manage Users"><Users /></GlobalLayout>
                ) : <Navigate to="/" />
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <GlobalLayout title="My Profile">
                  <Profile />
                </GlobalLayout>
              }
            />

            {/* Main Dashboard */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <GlobalLayout><HomeDashboard /></GlobalLayout>
                </PrivateRoute>
              }
            />

            {/* Category & Project */}
            <Route
              path="/category/:categoryId"
              element={
                <PrivateRoute>
                  <GlobalLayout><CategoryDashboard /></GlobalLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <PrivateRoute>
                  <GlobalLayout><ProjectLayout /></GlobalLayout>
                </PrivateRoute>
              }
            >
              <Route index element={<ProjectDashboard />} />
              <Route path="scripts" element={<ProjectDashboard />} />
              <Route path="breakdown/:scriptId" element={<FullBreakdown />} />
            </Route>

            {/* Breakdown & Draft Comparison */}
            <Route
              path="/breakdown/:id"
              element={<PrivateRoute><GlobalLayout><FullBreakdown /></GlobalLayout></PrivateRoute>}
            />
            <Route
              path="/comparison/:id"
              element={<PrivateRoute><GlobalLayout><DraftComparison /></GlobalLayout></PrivateRoute>}
            />

            {/* Global Modules */}
            <Route
              path="/global-module/:moduleId"
              element={<PrivateRoute><GlobalLayout><GlobalModulePage /></GlobalLayout></PrivateRoute>}
            />
            <Route
              path="/module/:moduleName"
              element={<PrivateRoute><GlobalLayout><DynamicModulePage /></GlobalLayout></PrivateRoute>}
            />

            {/* Upload Modal (no layout) */}
            <Route
              path="/upload"
              element={<PrivateRoute><UploadModal open onClose={() => {}} onUploadComplete={() => {}} /></PrivateRoute>}
            />
            <Route
              path="/view"
              element={<PrivateRoute><ModalView open onClose={() => {}} scriptDetails={null} /></PrivateRoute>}
            />

            {/* Request Flow */}
            <Route
              path="/requests/new"
              element={<PrivateRoute><GlobalLayout><RequestPage /></GlobalLayout></PrivateRoute>}
            />
            <Route
              path="/requests/pending"
              element={<PrivateRoute><GlobalLayout><PendingRequestsPage /></GlobalLayout></PrivateRoute>}
            />
            <Route
              path="/checkout"
              element={<PrivateRoute><GlobalLayout><CheckOutPage /></GlobalLayout></PrivateRoute>}
            />
            <Route path="/scanner/checkout" element={<PrivateRoute><CheckOutScanner /></PrivateRoute>} />
            <Route path="/scanner/checkin" element={<PrivateRoute><CheckInScanner /></PrivateRoute>} />
            <Route path="/scanner/checkout/:requestId" element={<PrivateRoute><RequestScanner /></PrivateRoute>} />

            {/* ✅ CLICKUP ROUTES */}

            {/* WorkspacePage WITHOUT sidebar */}
            <Route
              path="/clickup/workspaces"
              element={<PrivateRoute><WorkspacePage /></PrivateRoute>}
            />

            {/* Pages that use SidebarClickup layout */}
            <Route
              path="/clickup"
              element={<PrivateRoute><SidebarClickup /></PrivateRoute>}
            >
              <Route path="workspace/:workspaceId/space/:spaceId" element={<SpacePage />} />
              <Route path="workspace/:workspaceId/space/:spaceId/folder/:folderId" element={<FolderPage />} />
              <Route path="workspace/:workspaceId/space/:spaceId/folder/:folderId/list/:listId" element={<ListPage />} />
            </Route>

          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
