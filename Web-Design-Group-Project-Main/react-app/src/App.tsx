import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import UserManagement from './components/UserManagement';
import AddArtist from './components/AddArtist';
import UploadProduct from './components/UploadProduct';
import Collection from './components/Collections/Collection';
import CartView from './components/Cart/CartView';
import CheckoutPage from './components/Checkout/CheckoutPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Auth from './components/Auth/Auth';
import Homepage from './components/Homepage/Homepage';
import Dashboard from './components/Artist/Dashboard';

import Table from './components/Admin/Table';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />

          <Route path="/login" element={<Auth />} />

          <Route path="/signup" element={<Auth />} />
          
          <Route path="/homepage" element={
            <ProtectedRoute requiredRole="customer">
              <Homepage />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/collection/:category" element={
            <ProtectedRoute requiredRole="customer">
              <Collection />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute requiredRole="customer">
              <CartView />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute requiredRole="customer">
              <CheckoutPage />
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

          <Route path="/admin/table" element={
            <ProtectedRoute requiredRole="admin">
              <Table />

            </ProtectedRoute>
          } />
          
          <Route path="/admin/add-artist" element={
            <ProtectedRoute requiredRole="admin">
              <AddArtist />
            </ProtectedRoute>
          } />

          <Route path="/admin/upload-product" element={
            <ProtectedRoute requiredRole="admin">
              <UploadProduct />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
