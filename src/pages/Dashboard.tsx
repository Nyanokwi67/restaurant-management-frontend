import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Miriam's Restaurant</h1>
                <p className="text-xs text-orange-600 font-semibold uppercase">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-gray-600 text-lg">Here's what's happening in your restaurant today.</p>
        </div>

        {/* Role-specific Dashboard */}
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'manager' && <ManagerDashboard />}
        {user?.role === 'waiter' && <WaiterDashboard />}
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon="💰" label="Today's Sales" value="KES 45,000" color="from-green-500 to-emerald-600" />
        <StatCard icon="📊" label="Total Orders" value="32" color="from-blue-500 to-indigo-600" />
        <StatCard icon="👥" label="Active Staff" value="8" color="from-purple-500 to-pink-600" />
        <StatCard icon="⏳" label="Pending Expenses" value="3" color="from-orange-500 to-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/register')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
            >
              <span className="text-2xl">👥</span>
              <span className="font-semibold text-gray-900">Manage Users</span>
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
            >
              <span className="text-2xl">📋</span>
              <span className="font-semibold text-gray-900">View All Orders</span>
            </button>
            <button 
              onClick={() => navigate('/tables')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
            >
              <span className="text-2xl">🪑</span>
              <span className="font-semibold text-gray-900">View Tables</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem text="New user created: John Doe" time="10 mins ago" />
            <ActivityItem text="Expense approved: Kitchen supplies" time="1 hour ago" />
            <ActivityItem text="Daily report generated" time="2 hours ago" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Manager Dashboard
const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon="🍔" label="Menu Items" value="24" color="from-yellow-500 to-orange-600" />
        <StatCard icon="🪑" label="Tables" value="12" color="from-blue-500 to-indigo-600" />
        <StatCard icon="📋" label="Today's Orders" value="18" color="from-green-500 to-emerald-600" />
        <StatCard icon="💸" label="Pending Expenses" value="2" color="from-red-500 to-pink-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/tables')}
            className="flex flex-col items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
          >
            <span className="text-2xl">🪑</span>
            <span className="font-semibold text-gray-900 text-sm">Manage Tables</span>
          </button>
          <button 
            onClick={() => navigate('/orders')}
            className="flex flex-col items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
          >
            <span className="text-2xl">📊</span>
            <span className="font-semibold text-gray-900 text-sm">View Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Waiter Dashboard
const WaiterDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="🪑" label="My Tables" value="4" color="from-blue-500 to-indigo-600" />
        <StatCard icon="📋" label="Active Orders" value="3" color="from-green-500 to-emerald-600" />
        <StatCard icon="✅" label="Completed Today" value="12" color="from-purple-500 to-pink-600" />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/tables')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
          >
            <span className="text-3xl">🪑</span>
            <span className="font-semibold text-gray-900">View Tables</span>
          </button>
          <button 
            onClick={() => navigate('/orders')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition border-2 border-orange-200 hover:border-orange-300"
          >
            <span className="text-3xl">📋</span>
            <span className="font-semibold text-gray-900">My Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 hover:shadow-xl transition">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
};

const ActivityItem: React.FC<{ text: string; time: string }> = ({ text, time }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-700">{text}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  );
};

export default Dashboard;