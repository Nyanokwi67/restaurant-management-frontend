import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetTablesQuery } from '../app/services/api';
import { motion } from 'framer-motion';

const Tables: React.FC = () => {
  const { data: tables = [], isLoading, error } = useGetTablesQuery();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-700"
        >
          Loading tables...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-gray-900 mb-4">Failed to load tables</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const freeTables = tables.filter((table) => table.status === 'free');
  const occupiedTables = tables.filter((table) => table.status === 'occupied');

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
                <h1 className="text-xl font-black text-gray-900">Tables</h1>
                <p className="text-xs text-gray-600 font-semibold">Manage Tables</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Dashboard
              </button>
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
          className="mb-8"
        >
          <h2 className="text-4xl font-black text-gray-900 mb-2">Restaurant Tables</h2>
          <p className="text-gray-600 text-lg">
            {freeTables.length} available • {occupiedTables.length} occupied
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tables.map((table, index) => (
            <motion.div
              key={table.id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              className={`rounded-2xl p-6 shadow-xl border-2 transition ${
                table.status === 'free'
                  ? 'bg-white border-gray-100'
                  : 'bg-gray-100 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="text-3xl font-black text-gray-900"
                >
                  Table {table.number}
                </motion.h3>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, type: 'spring' }}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    table.status === 'free'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {table.status.toUpperCase()}
                </motion.span>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900">{table.seats}</span> seats
                </p>
              </div>

              {table.status === 'free' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/create-order/${table.id}`)}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                  Create Order
                </motion.button>
              )}

              {table.status === 'occupied' && (
                <div className="text-center py-3 bg-gray-200 rounded-xl">
                  <p className="text-gray-700 font-bold">Table is occupied</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {tables.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No tables available</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tables;