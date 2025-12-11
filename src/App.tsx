// src/App.tsx - Updated with PaymentCallback

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Tables from './pages/tables';
import Orders from './pages/orders';
import CreateOrder from './pages/CreateOrder';
import OrderDetails from './pages/OrderDetails';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/Register';
import ProfitLoss from './pages/ProfitLoss';
import PaymentCallback from './pages/PaymentCallback'; //  NEW IMPORT

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Payment Callback Route (can be public for Paystack redirect) */}
          <Route path="/payment/callback" element={<PaymentCallback />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
          <Route path="/create-order/:tableId" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/profit-loss" element={<ProtectedRoute><ProfitLoss /></ProtectedRoute>} />
          <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;