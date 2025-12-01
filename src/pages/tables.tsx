import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tablesAPI } from '../services/api';

interface Table {
  id: number;
  number: number;
  seats: number;
  status: 'free' | 'occupied';
}

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await tablesAPI.getAll();
      setTables(data);
    } catch (err: any) {
      setError('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (table: Table) => {
    if (table.status === 'free') {
      navigate(`/create-order/${table.id}`);
    } else {
      navigate(`/orders`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Miriam'sRestaurant</h1>
                <p className="text-xs text-orange-600 font-semibold uppercase">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
              >
                My Orders
              </button>
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

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Restaurant Tables 🪑</h2>
          <p className="text-gray-600 text-lg">Select a table to create or view orders</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`p-8 rounded-2xl border-4 text-center transition transform hover:scale-105 hover:shadow-2xl ${
                table.status === 'free'
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : 'bg-red-50 border-red-300 hover:bg-red-100'
              }`}
            >
              <div className="text-6xl mb-3">🪑</div>
              <p className="text-4xl font-black text-gray-900 mb-2">T{table.number}</p>
              <p className="text-sm text-gray-600 mb-1">{table.seats} seats</p>
              <p
                className={`text-xs font-bold uppercase mt-2 ${
                  table.status === 'free' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {table.status}
              </p>
            </button>
          ))}
        </div>

        {tables.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No tables found. Ask your manager to add tables.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;