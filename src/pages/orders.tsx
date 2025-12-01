import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  tableNumber: number;
  waiterName: string;
  items: string; // JSON string
  total: number;
  status: 'open' | 'paid';
  paymentMethod?: string;
  timestamp: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'paid'>('all');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getAll();
      // Filter to show only current waiter's orders
      const myOrders = data.filter((order: Order) => order.waiterName === user?.name);
      setOrders(myOrders);
    } catch (err: any) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const parseItems = (itemsString: string): OrderItem[] => {
    try {
      return JSON.parse(itemsString);
    } catch {
      return [];
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading orders...</div>
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
                onClick={() => navigate('/tables')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold"
              >
                Tables
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

      {/* Orders Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">My Orders 📋</h2>
          <p className="text-gray-600 text-lg">View and manage your orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'open'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
            }`}
          >
            Open Orders
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'paid'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
            }`}
          >
            Paid Orders
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const items = parseItems(order.items);
            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition cursor-pointer ${
                  order.status === 'open' ? 'border-yellow-300' : 'border-green-300'
                }`}
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-black text-gray-900">Table {order.tableNumber}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'open'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-gray-700">Items:</p>
                  {items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-gray-900">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-gray-500">+{items.length - 3} more items...</p>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-700">Total</p>
                  <p className="text-2xl font-black text-orange-600">
                    KES {order.total.toLocaleString()}
                  </p>
                </div>

                {order.status === 'paid' && order.paymentMethod && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Payment: <span className="font-bold uppercase">{order.paymentMethod}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <p className="text-2xl text-gray-500 mb-4">No {filter} orders found</p>
            <button
              onClick={() => navigate('/tables')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition"
            >
              Go to Tables
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;