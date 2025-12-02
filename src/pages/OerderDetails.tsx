import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  items: string;
  total: number;
  status: 'open' | 'paid';
  paymentMethod?: string;
  timestamp: string;
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await ordersAPI.getOne(parseInt(orderId || '0'));
      setOrder(data);
    } catch (err: any) {
      setError('Failed to load order');
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

  const handlePayment = async (paymentMethod: string) => {
    if (!order) return;

    if (!confirm(`Process payment via ${paymentMethod}?`)) return;

    setProcessing(true);
    try {
      await ordersAPI.update(order.id, {
        status: 'paid',
        paymentMethod: paymentMethod,
      });

      alert('Payment processed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const items = parseItems(order.items);

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
                <h1 className="text-xl font-black text-gray-900">Order Details</h1>
                <p className="text-xs text-orange-600 font-semibold">Order #{order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                ← Back
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">
                    Table {order.tableNumber}
                  </h2>
                  <p className="text-gray-600">
                    Waiter: <span className="font-semibold">{order.waiterName}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  {order.status === 'open' ? (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                      OPEN
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      PAID
                    </span>
                  )}
                </div>
              </div>

              {order.status === 'paid' && order.paymentMethod && (
                <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-green-700 font-semibold">
                    💳 Payment Method: {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h3 className="text-2xl font-black text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                      <p className="text-sm text-gray-600">KES {item.price} each</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold text-orange-600">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-gray-700">Total</p>
                  <p className="text-4xl font-black text-orange-600">
                    KES {order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200 sticky top-6">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Payment</h3>

              {order.status === 'open' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Select payment method:</p>

                  <button
                    onClick={() => handlePayment('cash')}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💵 Cash
                  </button>

                  <button
                    onClick={() => handlePayment('mpesa')}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📱 M-Pesa
                  </button>

                  <button
                    onClick={() => handlePayment('card')}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💳 Card
                  </button>

                  {processing && (
                    <div className="text-center text-orange-600 font-semibold">
                      Processing payment...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-2xl font-bold text-green-700 mb-2">Payment Complete</p>
                  <p className="text-gray-600">
                    Paid via {order.paymentMethod?.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;