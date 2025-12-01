import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-red-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center transform rotate-3">
                <span className="text-3xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Miriam'sRestaurant</h1>
                <p className="text-xs text-orange-600 font-semibold">Restaurant Management</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-700 transition shadow-lg"
            >
              Staff Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
            Streamline Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Restaurant Operations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Complete point-of-sale system for managing orders, tables, inventory, and staff. 
            Built for efficiency and ease of use.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition transform hover:scale-105 shadow-2xl"
          >
            Get Started →
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Role Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Separate access levels for Admins, Managers, and Waiters. 
              Secure authentication with role-based permissions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor orders, track expenses, manage inventory, and view sales reports in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing</h3>
            <p className="text-gray-600 leading-relaxed">
              Accept multiple payment methods: Cash, M-Pesa, and Card. 
              Track all transactions securely.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">🍔</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Menu Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Easy menu updates, pricing changes, and availability tracking. 
              Organize by categories.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">🪑</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Table Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Track table occupancy, assign waiters, and manage seating efficiently.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Financial Reports</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate daily, weekly, and monthly reports. Track profit margins and expense approvals.
            </p>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Three User Roles</h2>
          <p className="text-gray-600 text-lg mb-12">Designed for different levels of access and responsibility</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold mb-3">Admin</h3>
              <ul className="text-left space-y-2 text-purple-100">
                <li>• Manage all users</li>
                <li>• Approve expenses</li>
                <li>• View all reports</li>
                <li>• Full system access</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-4">👔</div>
              <h3 className="text-2xl font-bold mb-3">Manager</h3>
              <ul className="text-left space-y-2 text-blue-100">
                <li>• Manage menu & tables</li>
                <li>• Submit expenses</li>
                <li>• Monitor orders</li>
                <li>• View sales data</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="text-2xl font-bold mb-3">Waiter</h3>
              <ul className="text-left space-y-2 text-green-100">
                <li>• Take customer orders</li>
                <li>• Manage tables</li>
                <li>• Process payments</li>
                <li>• View order history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Miriam'sRestaurant. Restaurant Management System.</p>
          <p className="text-gray-500 text-sm mt-2">Built with NestJS, React, TypeScript & SQL Server</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;