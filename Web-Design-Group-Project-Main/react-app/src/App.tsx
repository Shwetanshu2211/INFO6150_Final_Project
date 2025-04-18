import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import AddArtist from './components/AddArtist';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Auth from './components/Auth/Auth';
import Homepage from './components/Homepage/Homepage';
import Dashboard from './components/Artist/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Auth />} />
          
          <Route path="/homepage" element={
            <ProtectedRoute requiredRole="customer">
              <Homepage />
            </ProtectedRoute>
          } />
          
          <Route path="/artists/dashboard" element={
            <ProtectedRoute requiredRole="artist">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/user-management" element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/add-artist" element={
            <ProtectedRoute requiredRole="admin">
              <AddArtist />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
