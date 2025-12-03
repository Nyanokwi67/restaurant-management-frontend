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
      alert('This table is currently occupied');
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
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Restaurant Tables</h1>
                <p className="text-xs text-orange-600 font-semibold">Table Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Dashboard
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
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Available Tables</h2>
          <p className="text-gray-600 text-lg">Click on a free table to create an order</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              disabled={table.status === 'occupied'}
              className={`relative p-8 rounded-2xl shadow-xl transition transform hover:scale-105 ${
                table.status === 'free'
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 cursor-pointer'
                  : 'bg-gradient-to-br from-red-400 to-orange-500 cursor-not-allowed opacity-75'
              }`}
            >
              <div className="text-center text-white">
                <div className="text-5xl font-black mb-2">T{table.number}</div>
                <div className="h-1 w-16 bg-white rounded-full mx-auto mb-3"></div>
                <div className="text-lg font-bold mb-1">
                  {table.status === 'free' ? 'FREE' : 'OCCUPIED'}
                </div>
                <div className="text-sm opacity-90">{table.seats} Seats</div>
              </div>
            </button>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-500 text-lg">No tables found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;