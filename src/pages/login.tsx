// src/pages/login.tsx - Updated with role-based redirect

import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting login...', { username });
      await login(username, password);
      
      // Get user info from localStorage (just set by login function)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('✅ Login successful! Navigating to dashboard...');
        
        // ✅ ROLE-BASED REDIRECT
        if (user.role === 'admin') {
          navigate('/admin-panel'); // Admins go to Admin Panel
        } else {
          navigate('/dashboard'); // Waiters and Managers go to regular Dashboard
        }
      }
    } catch (error: any) {
      console.log('❌ Login failed:', error.message);
      alert(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-black text-white">MR</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition bg-white text-gray-900 font-medium"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition bg-white text-gray-900 font-medium"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Miriam's Restaurant Management System</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;