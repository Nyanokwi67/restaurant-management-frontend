// src/pages/OrderDetails.tsx - Simplified with modular components

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  useGetOrderQuery, 
  useUpdateOrderMutation, 
  useCreatePaymentMutation,
} from '../app/services/api';
import { motion } from 'framer-motion';
import PaystackPaymentModal from '../components/PaystackPaymentModal';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [showPaystackModal, setShowPaystackModal] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const orderIdNum = parseInt(orderId || '0');
  const { data: order, isLoading, error } = useGetOrderQuery(orderIdNum, {
    skip: !orderIdNum || orderIdNum === 0,
  });
  const [updateOrder] = useUpdateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePayment = async (method: string) => {
    if (!order) return;

    if (method === 'paystack') {
      setShowPaystackModal(true);
      return;
    }

    // Handle cash payment
    try {
      await createPayment({
        orderId: order.id,
        amount: order.total,
        method: method,
        status: 'completed',
      }).unwrap();

      await updateOrder({
        id: order.id,
        data: {
          status: 'paid',
          paymentMethod: method,
        },
      }).unwrap();

      alert(`✅ Payment processed successfully via ${method.toUpperCase()}!`);
      navigate('/orders');
    } catch (err) {
      console.error('Payment error:', err);
      alert('❌ Failed to process payment');
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
          {/* Order Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
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
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'paid' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
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
          </motion.div>

          {/* Order Items & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
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
                
                {/* Cash Payment */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('cash')}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                  💵 Cash Payment
                </motion.button>
                
                {/* Paystack - Card & Mobile Money */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('paystack')}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
                >
                  💳 Card / Mobile Money (Paystack)
                </motion.button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Paystack accepts: Credit/Debit Cards, M-Pesa, Bank Transfer
                </p>
              </div>
            )}

            {order.status === 'paid' && (
              <div className="bg-gray-100 border-2 border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-900 font-bold text-lg">✅ Payment Completed</p>
                <p className="text-gray-600">This order has been paid</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Paystack Modal Component */}
      <PaystackPaymentModal
        isOpen={showPaystackModal}
        onClose={() => setShowPaystackModal(false)}
        orderId={order.id}
        amount={order.total}
      />
    </div>
  );
};

export default OrderDetails;