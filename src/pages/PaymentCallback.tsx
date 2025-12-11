// src/pages/PaymentCallback.tsx - Dedicated Paystack Callback Page

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useVerifyPaystackPaymentQuery,
  useCreatePaymentMutation,
  useUpdateOrderMutation,
} from '../app/services/api';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref'); // Paystack sometimes uses 'trxref'
  const orderId = searchParams.get('orderId');
  
  // Extract orderId from reference if not provided separately
  // Reference format: ORDER_1009_1765430839436
  const extractedOrderId = reference?.match(/ORDER_(\d+)_/)?.[1];
  const finalOrderId = orderId || extractedOrderId;
  const finalReference = reference || trxref;
  
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: verifyData, error: verifyError } = useVerifyPaystackPaymentQuery(finalReference || '', {
    skip: !finalReference,
  });

  const [createPayment] = useCreatePaymentMutation();
  const [updateOrder] = useUpdateOrderMutation();

  useEffect(() => {
    console.log('🔍 Callback URL params:', {
      reference: finalReference,
      orderId: finalOrderId,
      extractedOrderId,
      allParams: Object.fromEntries(searchParams.entries())
    });

    if (!finalReference) {
      setVerificationStatus('failed');
      setErrorMessage('Missing payment reference');
      return;
    }

    if (!finalOrderId) {
      setVerificationStatus('failed');
      setErrorMessage('Could not determine order ID from reference');
      return;
    }

    if (verifyData) {
      handlePaymentVerification(verifyData);
    }

    if (verifyError) {
      console.error('❌ Verify error:', verifyError);
      setVerificationStatus('failed');
      setErrorMessage('Failed to verify payment. Please contact support.');
    }
  }, [verifyData, verifyError, finalReference, finalOrderId]);

  const handlePaymentVerification = async (verificationData: any) => {
    try {
      if (!verificationData.success) {
        setVerificationStatus('failed');
        setErrorMessage(verificationData.message || 'Payment verification failed');
        return;
      }

      console.log('✅ Payment verified:', verificationData);

      // ✅ FIXED: Create payment record (backend verify endpoint no longer creates it)
      await createPayment({
        orderId: parseInt(finalOrderId!),
        amount: verificationData.data.amount / 100, // Paystack amount is in kobo/cents
        method: 'card', // Use 'card' for backend compatibility
        status: 'completed',
        transactionId: verificationData.data.reference,
      }).unwrap();

      console.log('✅ Payment record created');

      // Update order status
      await updateOrder({
        id: parseInt(finalOrderId!),
        data: {
          status: 'paid',
          paymentMethod: 'card',
        },
      }).unwrap();

      console.log('✅ Order updated to paid');

      setVerificationStatus('success');
      
      // Redirect to order details after 3 seconds
      setTimeout(() => {
        navigate(`/orders/${finalOrderId}`);
      }, 3000);

    } catch (err: any) {
      console.error('❌ Payment processing error:', err);
      setVerificationStatus('failed');
      setErrorMessage(err?.data?.message || 'Failed to process payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
      >
        {verificationStatus === 'verifying' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-4xl">✅</span>
            </motion.div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been confirmed and the order has been updated.
            </p>
            <div className="bg-green-50 border-2 border-green-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Order ID:</span> #{finalOrderId}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Reference:</span> {finalReference}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to order details in 3 seconds...
            </p>
          </>
        )}

        {verificationStatus === 'failed' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-4xl">❌</span>
            </motion.div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 mb-6">
              {finalReference && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Reference:</span> {finalReference}
                </p>
              )}
              {finalOrderId && (
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Order ID:</span> #{finalOrderId}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/orders')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Back to Orders
              </motion.button>
              {finalOrderId && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/orders/${finalOrderId}`)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  View Order
                </motion.button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;