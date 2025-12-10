// src/pages/OrderDetails.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  useGetOrderQuery, 
  useUpdateOrderMutation, 
  useCreatePaymentMutation,
  useInitiateMpesaPaymentMutation 
} from '../app/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const orderIdNum = parseInt(orderId || '0');
  const { data: order, isLoading, error } = useGetOrderQuery(orderIdNum, {
    skip: !orderIdNum || orderIdNum === 0,
  });
  const [updateOrder] = useUpdateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();
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
      // Create payment record
      await createPayment({
        orderId: order.id,
        amount: order.total,
        method: method,
        status: 'completed',
      }).unwrap();

      // Update order status
      await updateOrder({
        id: order.id,
        data: {
          status: 'paid',
          paymentMethod: method,
        },
      }).unwrap();

      alert(`Payment processed successfully via ${method.toUpperCase()}!`);
      navigate('/orders');
    } catch (err) {
      console.error('Payment error:', err);
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
      // Initiate M-Pesa STK Push
      const mpesaResult = await initiateMpesa({
        phoneNumber,
        amount: order.total,
        orderId: order.id,
      }).unwrap();

      console.log('M-Pesa result:', mpesaResult);

      // Create payment record
      await createPayment({
        orderId: order.id,
        amount: order.total,
        method: 'mpesa',
        status: 'completed',
        phoneNumber: phoneNumber,
        transactionId: mpesaResult.data?.CheckoutRequestID || 'DEMO_' + Date.now(),
      }).unwrap();

      // Update order status
      await updateOrder({
        id: order.id,
        data: {
          status: 'paid',
          paymentMethod: 'mpesa',
        },
      }).unwrap();

      alert('M-Pesa payment initiated successfully! Customer will receive a prompt on their phone.');
      setShowMpesaModal(false);
      navigate('/orders');
    } catch (err) {
      console.error('M-Pesa payment error:', err);
      alert('Failed to process M-Pesa payment');
    } finally {
      setProcessingPayment(false);
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
          Loading order...
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-gray-900 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Back to Orders
          </button>
        </motion.div>
      </div>
    );
  }

  const orderItems = order.items ? JSON.parse(order.items) : [];

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
                <h1 className="text-xl font-black text-gray-900">Order #{order.id}</h1>
                <p className="text-xs text-gray-600 font-semibold">Order Details</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
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
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Information</h2>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-xl font-bold text-gray-900">#{order.id}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-gray-500">Table</p>
                <p className="text-xl font-bold text-gray-900">Table {order.tableNumber}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-gray-500">Waiter</p>
                <p className="text-xl font-bold text-gray-900">{order.waiterName}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-500">Status</p>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    order.status === 'paid'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {order.status.toUpperCase()}
                </motion.span>
              </motion.div>

              {order.paymentMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-xl font-bold text-gray-900">{order.paymentMethod.toUpperCase()}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Items</h2>

            <div className="space-y-3 mb-6">
              {orderItems.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                >
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + orderItems.length * 0.1 }}
              className="border-t-2 border-gray-100 pt-4 mb-6"
            >
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-gray-700">Total</p>
                <motion.p
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-black text-gray-900"
                >
                  KES {order.total.toLocaleString()}
                </motion.p>
              </div>
            </motion.div>

            {order.status === 'open' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + orderItems.length * 0.1 }}
                className="space-y-3"
              >
                <p className="font-bold text-gray-900 mb-2">Process Payment:</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('cash')}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                  Cash Payment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('mpesa')}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition shadow-lg"
                >
                  M-Pesa Payment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('card')}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition shadow-lg"
                >
                  Card Payment
                </motion.button>
              </motion.div>
            )}

            {order.status === 'paid' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-100 border-2 border-gray-200 rounded-xl p-4 text-center"
              >
                <p className="text-gray-900 font-bold text-lg">Payment Completed</p>
                <p className="text-gray-600">This order has been paid</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showMpesaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowMpesaModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
            >
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowMpesaModal(false)}
                  disabled={processingPayment}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMpesaPayment}
                  disabled={processingPayment}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                >
                  {processingPayment ? 'Processing...' : 'Send Prompt'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetails;