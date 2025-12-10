// src/pages/Dashboard.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetOrdersQuery, useGetTablesQuery, useGetPaymentsQuery, useGetExpensesQuery } from '../app/services/api';
import { useDispatch } from 'react-redux';
import { api } from '../app/services/api';
import { motion } from 'framer-motion';

type ActiveTab = 'dashboard' | 'tables' | 'orders' | 'payments' | 'expenses';

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: orders = [] } = useGetOrdersQuery(undefined);
  const { data: tables = [] } = useGetTablesQuery(undefined);
  const { data: payments = [] } = useGetPaymentsQuery(undefined);
  const { data: expenses = [] } = useGetExpensesQuery(undefined);

  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      dispatch(api.util.prefetch('getOrders', undefined) as any);
    }, 100);
    return () => clearTimeout(prefetchTimer);
  }, [dispatch]);

  // Check if user has access to financials
  const canAccessFinancials = user?.role === 'admin' || user?.role === 'manager';
  const canCreateOrders = user?.role === 'waiter' || user?.role === 'manager';

  // Calculate stats
  const stats = useMemo(() => {
    const availableTables = tables.filter((t: Table) => t.status === 'free').length;
    const activeOrders = orders.filter((o: Order) => o.status === 'open').length;
    const completedOrders = orders.filter((o: Order) => o.status === 'paid').length;
    const totalTables = tables.length;

    // Financial stats (only for managers)
    const totalRevenue = payments
      .filter((p: any) => p.status === 'completed')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    const totalExpenses = expenses
      .filter((e: any) => e.status === 'approved')
      .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    const paidOrders = orders.filter((o: any) => o.status === 'paid').length;
    const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

    return {
      availableTables,
      activeOrders,
      completedOrders,
      totalTables,
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      averageOrderValue,
    };
  }, [orders, tables, payments, expenses]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle navigation based on tab
  const handleTabNavigation = (tab: ActiveTab) => {
    if (tab === 'dashboard') {
      setActiveTab('dashboard');
    } else if (tab === 'tables') {
      navigate('/tables');
    } else if (tab === 'orders') {
      navigate('/orders');
    } else if (tab === 'payments') {
      navigate('/payments');
    } else if (tab === 'expenses') {
      navigate('/expenses');
    }
  };

  // Sidebar items based on role
  const sidebarItems = useMemo(() => {
    const items: { id: ActiveTab; label: string }[] = [
      { id: 'dashboard', label: 'Dashboard' },
    ];

    // Waiters and Managers can create orders
    if (canCreateOrders) {
      items.push({ id: 'tables', label: 'Tables' });
    }

    // Everyone can view orders
    items.push({ id: 'orders', label: 'Orders' });

    // Only managers can access financials
    if (canAccessFinancials) {
      items.push({ id: 'payments', label: 'Payments' });
      items.push({ id: 'expenses', label: 'Expenses' });
    }

    return items;
  }, [canCreateOrders, canAccessFinancials]);

  // Render Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <p className="text-gray-600 font-semibold mb-2">Available Tables</p>
          <p className="text-4xl font-black text-gray-900">{stats.availableTables}</p>
          <p className="text-sm text-gray-500 mt-1">of {stats.totalTables} total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <p className="text-gray-600 font-semibold mb-2">Active Orders</p>
          <p className="text-4xl font-black text-gray-900">{stats.activeOrders}</p>
          <p className="text-sm text-gray-500 mt-1">currently processing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <p className="text-gray-600 font-semibold mb-2">Completed Orders</p>
          <p className="text-4xl font-black text-gray-900">{stats.completedOrders}</p>
          <p className="text-sm text-gray-500 mt-1">successfully paid</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Tables - Only for waiters and managers */}
          {canCreateOrders && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tables')}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-gray-900 transition text-left"
            >
              <h4 className="text-lg font-black text-gray-900 mb-2">Tables</h4>
              <p className="text-3xl font-black text-gray-900 mb-1">{stats.totalTables}</p>
              <p className="text-gray-600 text-sm">Create orders</p>
            </motion.button>
          )}

          {/* Orders - Everyone */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/orders')}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-gray-900 transition text-left"
          >
            <h4 className="text-lg font-black text-gray-900 mb-2">Orders</h4>
            <p className="text-3xl font-black text-gray-900 mb-1">{orders.length}</p>
            <p className="text-gray-600 text-sm">View orders</p>
          </motion.button>

          {/* Payments - Managers only */}
          {canAccessFinancials && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/payments')}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100 hover:border-green-600 transition text-left"
            >
              <h4 className="text-lg font-black text-green-600 mb-2">Payments</h4>
              <p className="text-3xl font-black text-gray-900 mb-1">KES {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">View payments</p>
            </motion.button>
          )}

          {/* Expenses - Managers only */}
          {canAccessFinancials && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/expenses')}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-gray-900 transition text-left"
            >
              <h4 className="text-lg font-black text-gray-900 mb-2">Expenses</h4>
              <p className="text-3xl font-black text-gray-900 mb-1">KES {stats.totalExpenses.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Manage expenses</p>
            </motion.button>
          )}
        </div>
      </div>

      {/* System Overview - Different for Waiters vs Managers */}
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-4">System Overview</h3>
        
        {/* Waiter View - Simple Stats */}
        {user?.role === 'waiter' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders Today</span>
                <span className="text-gray-900 font-bold">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open Orders</span>
                <span className="text-gray-900 font-bold">{stats.activeOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Orders</span>
                <span className="text-gray-900 font-bold">{stats.completedOrders}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                <span className="text-gray-600 font-bold">Available Tables</span>
                <span className="text-gray-900 font-black text-lg">{stats.availableTables}</span>
              </div>
            </div>
          </div>
        )}

        {/* Manager View - Financial Stats */}
        {user?.role === 'manager' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <h4 className="text-lg font-black text-gray-900 mb-4">Operations</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="text-gray-900 font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Open Orders</span>
                  <span className="text-gray-900 font-bold">{stats.activeOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Orders</span>
                  <span className="text-gray-900 font-bold">{stats.completedOrders}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                  <span className="text-gray-600 font-bold">Available Tables</span>
                  <span className="text-gray-900 font-black text-lg">{stats.availableTables}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <h4 className="text-lg font-black text-gray-900 mb-4">Financials</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="text-gray-900 font-bold">KES {stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="text-gray-900 font-bold">KES {stats.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Order Value</span>
                  <span className="text-gray-900 font-bold">KES {stats.averageOrderValue.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                  <span className="text-gray-600 font-bold">Net Profit</span>
                  <span className={`font-black text-lg ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    KES {stats.netProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
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
                <p className="text-xs text-gray-600 font-semibold">Welcome, {user?.name}</p>
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

      <div className="flex">
        {/* Permanent Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-64 bg-gray-900 min-h-screen shadow-2xl"
        >
          <div className="p-6">
            <h2 className="text-white font-black text-lg mb-6">Menu</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabNavigation(item.id)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    activeTab === item.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
              </h2>
            </div>

            {renderDashboard()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;