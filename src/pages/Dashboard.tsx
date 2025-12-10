// src/pages/Dashboard.tsx - Complete Updated Version

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetOrdersQuery, useGetTablesQuery } from '../app/services/api';
import { useDispatch } from 'react-redux';
import { api } from '../app/services/api';
import { motion } from 'framer-motion';

interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
}

interface Order {
  id: number;
  tableId: number;
  tableNumber: number;
  waiterId: number;
  waiterName: string;
  items: string;
  total: number;
  status: string;
  paymentMethod?: string;
  timestamp: Date;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: orders = [] } = useGetOrdersQuery(undefined);
  const { data: tables = [] } = useGetTablesQuery(undefined);

  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      dispatch(api.util.prefetch('getOrders', undefined) as any);
    }, 100);
    return () => clearTimeout(prefetchTimer);
  }, [dispatch]);

  const stats = {
    tables: tables.filter((t: Table) => t.status === 'free').length,
    activeOrders: orders.filter((o: Order) => o.status === 'open').length,
    completedOrders: orders.filter((o: Order) => o.status === 'paid').length,
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if user has access to admin/manager features
  const canAccessFinancials = user?.role === 'admin' || user?.role === 'manager';
  
  // ✅ NEW: Only waiters and managers can create orders
  const canCreateOrders = user?.role === 'waiter' || user?.role === 'manager';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b-2 border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-600 font-semibold">Welcome back, {user?.name}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Logout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <p className="text-gray-600 font-semibold mb-2">Available Tables</p>
            <p className="text-4xl font-black text-gray-900">{stats.tables}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <p className="text-gray-600 font-semibold mb-2">Active Orders</p>
            <p className="text-4xl font-black text-gray-900">{stats.activeOrders}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <p className="text-gray-600 font-semibold mb-2">Completed Orders</p>
            <p className="text-4xl font-black text-gray-900">{stats.completedOrders}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {/* ✅ ONLY CHANGE: Tables button hidden for admin */}
          {canCreateOrders && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tables')}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-gray-900 transition text-left"
            >
              <h3 className="text-xl font-black text-gray-900 mb-2">Tables</h3>
              <p className="text-gray-600 text-sm">Manage restaurant tables</p>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/orders')}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-gray-900 transition text-left"
          >
            <h3 className="text-xl font-black text-gray-900 mb-2">Orders</h3>
            <p className="text-gray-600 text-sm">View all orders</p>
          </motion.button>

          {/* Only show Payments for admin/manager */}
          {canAccessFinancials && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/payments')}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-gray-900 transition text-left"
            >
              <h3 className="text-xl font-black text-gray-900 mb-2">Payments</h3>
              <p className="text-gray-600 text-sm">Payment history</p>
            </motion.button>
          )}

          {/* Only show Expenses for admin/manager */}
          {canAccessFinancials && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/expenses')}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-gray-900 transition text-left"
            >
              <h3 className="text-xl font-black text-gray-900 mb-2">Expenses</h3>
              <p className="text-gray-600 text-sm">Manage expenses</p>
            </motion.button>
          )}

          {user?.role === 'admin' && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin-panel')}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-gray-900 transition text-left"
            >
              <h3 className="text-xl font-black text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-gray-600 text-sm">Manage users & menu</p>
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;