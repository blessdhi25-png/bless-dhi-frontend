import React from 'react';
import {
  BrowserRouter, Routes, Route, Navigate
} from 'react-router-dom';
import Login    from './pages/Login';
import Register from './pages/Register';
import ManagerDashboard from './pages/ManagerDashboard';
import ClientDashboard  from './pages/ClientDashboard';
import AdminDashboard   from './pages/AdminDashboard';
import PaymentResult from './pages/PaymentResult';



// Auth guard
function RequireAuth({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;
  return children;
}

// Placeholder dashboards — we'll build these next
const ClientDash  = () => <h1 style={{color:'white',padding:40}}>Client Dashboard — Coming Next</h1>;
//const ManagerDash = () => <h1 style={{color:'white',padding:40}}>Manager Dashboard — Coming Next</h1>;
const ManagerDash = () => <ManagerDashboard />;
const AdminDash   = () => <h1 style={{color:'white',padding:40}}>Admin Dashboard — Coming Next</h1>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        import PaymentResult from './pages/PaymentResult';

// Add inside Routes:
<Route path="/payment/success" element={
  <RequireAuth allowedRoles={['client']}>
    <PaymentResult />
  </RequireAuth>
} />
<Route path="/payment/cancel" element={
  <RequireAuth allowedRoles={['client']}>
    <PaymentResult />
  </RequireAuth>
} />

        <Route path="/client" element={
  <RequireAuth allowedRoles={['client']}>
    <ClientDashboard />
  </RequireAuth>
} />
<Route path="/manager" element={
  <RequireAuth allowedRoles={['manager']}>
    <ManagerDashboard />
  </RequireAuth>
} />
        <Route path="/admin" element={
          <RequireAuth allowedRoles={['admin']}>
            <AdminDashboard />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}