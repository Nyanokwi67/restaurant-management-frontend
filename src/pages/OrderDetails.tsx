import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetOrderQuery, useUpdateOrderMutation, useInitiateMpesaPaymentMutation } from '../app/services/api';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useGetOrderQuery(parseInt(orderId || '0'));
  const [updateOrder] = useUpdateOrderMutation();
  const [initiateMpesa] = useInitiateMpesaPaymentMutation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePayment = async (method: string) => {
    if (!order) return;

    if (method === 'mpesa') {
      setShowMpesaModal(true);
      return;
    }

    try {
      await updateOrder({
        id: order.id,
        data: {
          status: 'paid',
          paymentMethod: method,
        },
      }).unwrap();

      alert('Payment processed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to process payment');
    }
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber || !order) {
      alert('Please enter a valid phone number');
      return;
    }

    setProcessingPayment(true);
    try {
      await initiateMpesa({
        phoneNumber,
        amount: order.total,
        orderId: order.id,
      }).unwrap();

      await updateOrder({
        id: order.id,
        data: {
          status: 'paid',
          paymentMethod: 'mpesa',
        },
      }).unwrap();

      alert('M-Pesa payment initiated successfully!');
      setShowMpesaModal(false);
      navigate('/orders');
    } catch (err) {
      alert('Failed to process M-Pesa payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderItems = order.items ? JSON.parse(order.items) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b-2 border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Order #{order.id}</h1>
                <p className="text-xs text-gray-600 font-semibold">Order Details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Back
              </button>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-xl font-bold text-gray-900">#{order.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Table</p>
                <p className="text-xl font-bold text-gray-900">Table {order.tableNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Waiter</p>
                <p className="text-xl font-bold text-gray-900">{order.waiterName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    order.status === 'paid'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-xl font-bold text-gray-900">{order.paymentMethod.toUpperCase()}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Items</h2>

            <div className="space-y-3 mb-6">
              {orderItems.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-gray-700">Total</p>
                <p className="text-3xl font-black text-gray-900">
                  KES {order.total.toLocaleString()}
                </p>
              </div>
            </div>

            {order.status === 'open' && (
              <div className="space-y-3">
                <p className="font-bold text-gray-900 mb-2">Process Payment:</p>
                <button
                  onClick={() => handlePayment('cash')}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                  Cash Payment
                </button>
                <button
                  onClick={() => handlePayment('mpesa')}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition shadow-lg"
                >
                  M-Pesa Payment
                </button>
                <button
                  onClick={() => handlePayment('card')}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition shadow-lg"
                >
                  Card Payment
                </button>
              </div>
            )}

            {order.status === 'paid' && (
              <div className="bg-gray-100 border-2 border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-900 font-bold text-lg">Payment Completed</p>
                <p className="text-gray-600">This order has been paid</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMpesaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">M-Pesa Payment</h2>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Customer Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712345678 or 254712345678"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the customer's M-Pesa phone number
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Amount:</span> KES {order.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Customer will receive an M-Pesa prompt on their phone
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMpesaModal(false)}
                disabled={processingPayment}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMpesaPayment}
                disabled={processingPayment}
                className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
              >
                {processingPayment ? 'Processing...' : 'Send Prompt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;