import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

interface Order {
  id: number;
  tableNumber: number;
  waiterName: string;
  items: string;
  total: number;
  status: 'open' | 'paid';
  paymentMethod?: string;
  timestamp: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'paid'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filter, orders]);

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err: any) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filter));
    }
  };

  const parseItems = (itemsString: string) => {
    try {
      const items = JSON.parse(itemsString);
      return items.map((item: any) => item.name).join(', ');
    } catch {
      return 'No items';
    }
  };

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
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">My Orders</h1>
                <p className="text-xs text-orange-600 font-semibold">Order Management</p>
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
          <h2 className="text-4xl font-black text-gray-900 mb-4">Orders</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'open'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'paid'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate(`/order/${order.id}`)}
              className="w-full bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-2xl transition text-left"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-black">T{order.tableNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Table {order.tableNumber}</h3>
                      <p className="text-sm text-gray-500">by {order.waiterName}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-orange-600">KES {order.total.toLocaleString()}</p>
                  {order.status === 'open' ? (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold mt-2">
                      OPEN
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mt-2">
                      PAID
                    </span>
                  )}
                </div>
              </div>
              <div className="h-px bg-gray-200 my-3"></div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Items:</span> {parseItems(order.items)}
              </p>
              {order.paymentMethod && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Payment:</span> {order.paymentMethod.toUpperCase()}
                </p>
              )}
              <p className="text-gray-500 text-sm">{new Date(order.timestamp).toLocaleString()}</p>
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;