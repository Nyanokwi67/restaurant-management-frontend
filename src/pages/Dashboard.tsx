import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, tablesAPI } from '../services/api';

interface Order {
  id: number;
  status: 'open' | 'paid';
}

interface Table {
  id: number;
  status: 'free' | 'occupied';
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tables: 0,
    activeOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const orders: Order[] = await ordersAPI.getAll();
      const tables: Table[] = await tablesAPI.getAll();

      setStats({
        tables: tables.filter((t) => t.status === 'free').length,
        activeOrders: orders.filter((o) => o.status === 'open').length,
        completedOrders: orders.filter((o) => o.status === 'paid').length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const AdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-purple-100 text-sm font-semibold mb-2">Available Tables</p>
          <p className="text-5xl font-black">{stats.tables}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-orange-100 text-sm font-semibold mb-2">Active Orders</p>
          <p className="text-5xl font-black">{stats.activeOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-green-100 text-sm font-semibold mb-2">Completed Orders</p>
          <p className="text-5xl font-black">{stats.completedOrders}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/register')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Register Staff</h3>
          <p className="text-gray-600">Add new users to the system</p>
        </button>

        <button
          onClick={() => navigate('/tables')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">View Tables</h3>
          <p className="text-gray-600">Manage restaurant tables</p>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Orders</h3>
          <p className="text-gray-600">View all restaurant orders</p>
        </button>
      </div>
    </div>
  );

  const ManagerDashboard = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-blue-100 text-sm font-semibold mb-2">Available Tables</p>
          <p className="text-5xl font-black">{stats.tables}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-orange-100 text-sm font-semibold mb-2">Active Orders</p>
          <p className="text-5xl font-black">{stats.activeOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-green-100 text-sm font-semibold mb-2">Completed Orders</p>
          <p className="text-5xl font-black">{stats.completedOrders}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/tables')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">View Tables</h3>
          <p className="text-gray-600">Manage restaurant tables</p>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Orders</h3>
          <p className="text-gray-600">View all restaurant orders</p>
        </button>
      </div>
    </div>
  );

  const WaiterDashboard = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-green-100 text-sm font-semibold mb-2">Available Tables</p>
          <p className="text-5xl font-black">{stats.tables}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-orange-100 text-sm font-semibold mb-2">Active Orders</p>
          <p className="text-5xl font-black">{stats.activeOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="h-1 w-16 bg-white rounded-full mb-4"></div>
          <p className="text-blue-100 text-sm font-semibold mb-2">Completed Orders</p>
          <p className="text-5xl font-black">{stats.completedOrders}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/tables')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">View Tables</h3>
          <p className="text-gray-600">See available tables</p>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition transform hover:-translate-y-2 text-left"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h3>
          <p className="text-gray-600">View your orders</p>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
                <p className="text-xs text-orange-600 font-semibold capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Online</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition font-semibold shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Welcome back, <span className="text-orange-600">{user?.name?.split(' ')[0]}</span>!
          </h2>
          <p className="text-gray-600 text-lg">Here's what's happening in your restaurant today.</p>
        </div>

        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'manager' && <ManagerDashboard />}
        {user?.role === 'waiter' && <WaiterDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;