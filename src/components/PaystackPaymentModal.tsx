// src/components/PaystackPaymentModal.tsx - PHONE FORMAT FIX

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInitializePaystackPaymentMutation } from '../app/services/api';

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  amount: number;
}

const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
}) => {
  const [paymentChannel, setPaymentChannel] = useState<'card' | 'mobile_money'>('card');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('0708374149'); // Default test number
  const [loading, setLoading] = useState(false);
  const [initializePayment] = useInitializePaystackPaymentMutation();

  // ✅ NEW: Format phone number for Paystack
  const formatPhoneNumber = (phone: string): string => {
    // Remove any spaces, dashes, or special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    // If doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    // Remove + if present
    cleaned = cleaned.replace('+', '');
    
    return cleaned;
  };

  const handlePayment = async () => {
    // Validate email
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate phone for mobile money
    if (paymentChannel === 'mobile_money') {
      if (!phoneNumber) {
        alert('Please enter a phone number for M-Pesa');
        return;
      }

      // Format the phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // ✅ UPDATED: Check formatted number against test number
      if (formattedPhone !== '254708374149') {
        alert(`⚠️ TEST MODE - Use Paystack test number only!\n\nEnter: 0708374149 or 254708374149\n\nYou entered: ${formattedPhone}`);
        return;
      }
    }

    setLoading(true);

    try {
      // ✅ UPDATED: Send formatted phone number
      const formattedPhone = paymentChannel === 'mobile_money' 
        ? formatPhoneNumber(phoneNumber) 
        : undefined;

      const response = await initializePayment({
        orderId,
        email,
        amount,
        channel: paymentChannel,
        phoneNumber: formattedPhone, // ✅ Send formatted phone
      }).unwrap();

      if (response.success) {
        localStorage.setItem('pending_payment', JSON.stringify({
          orderId,
          amount,
          reference: response.reference,
          method: paymentChannel === 'card' ? 'card' : 'mpesa',
        }));

        window.location.href = response.authorization_url;
      } else {
        alert('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">Payment with Paystack</h2>

            {/* Payment Channel Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Card Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPaymentChannel('card')}
                  className={`p-4 rounded-xl border-2 transition ${
                    paymentChannel === 'card'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-blue-400'
                  }`}
                >
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-bold">Card</div>
                  <div className="text-xs mt-1 opacity-80">Visa, Mastercard</div>
                </motion.button>

                {/* Mobile Money Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPaymentChannel('mobile_money')}
                  className={`p-4 rounded-xl border-2 transition ${
                    paymentChannel === 'mobile_money'
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-green-400'
                  }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-bold">M-Pesa</div>
                  <div className="text-xs mt-1 opacity-80">Mobile Money</div>
                </motion.button>
              </div>
            </div>

            {/* Info Banner */}
            <div className={`mb-6 rounded-xl p-4 border-2 ${
              paymentChannel === 'card' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm ${
                paymentChannel === 'card' ? 'text-blue-900' : 'text-green-900'
              }`}>
                {paymentChannel === 'card' 
                  ? '💳 You will be redirected to Paystack\'s secure card payment page'
                  : '📱 You will receive an M-Pesa prompt on your phone'
                }
              </p>
            </div>

            {/* Amount Display */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Order Amount:</p>
              <p className="text-3xl font-black text-gray-900">KES {amount.toLocaleString()}</p>
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gray-900 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Payment receipt will be sent here</p>
            </div>

            {/* Phone Number Input (M-Pesa Only) */}
            {paymentChannel === 'mobile_money' && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  M-Pesa Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0708374149"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-600 focus:outline-none"
                />
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-yellow-900 font-bold">⚠️ PAYSTACK TEST MODE</p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Required test number: <span className="font-bold">0708374149</span>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Also accepts: 254708374149 or +254708374149
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={loading}
                className={`flex-1 px-6 py-3 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 ${
                  paymentChannel === 'card'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Processing...' : 'Continue to Paystack'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaystackPaymentModal;