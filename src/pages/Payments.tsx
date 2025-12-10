// src/pages/Payments.tsx - Shows paid orders directly

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetOrdersQuery } from '../app/services/api';
import { motion } from 'framer-motion';

const Payments: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading, error } = useGetOrdersQuery(undefined);

  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'mpesa' | 'card'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get only paid orders (these are our "payments")
  const paidOrders = useMemo(() => {
    return orders.filter((order: any) => order.status === 'paid');
  }, [orders]);

  const filteredPayments = useMemo(() => {
    let filtered = [...paidOrders];

    if (methodFilter !== 'all') {
      filtered = filtered.filter((order: any) => 
        order.paymentMethod?.toLowerCase() === methodFilter
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((order: any) => {
        const orderId = String(order.id);
        const amount = String(order.total);
        const tableNumber = String(order.tableNumber);
        const waiterName = order.waiterName?.toLowerCase() || '';

        return orderId.includes(searchLower) ||
               amount.includes(searchLower) ||
               tableNumber.includes(searchLower) ||
               waiterName.includes(searchLower);
      });
    }

    return filtered.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [paidOrders, methodFilter, searchTerm]);

  const totalAmount = useMemo(() => {
    return filteredPayments.reduce((sum: number, order: any) => sum + Number(order.total), 0);
  }, [filteredPayments]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Failed to load payments</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-black text-gray-900">Payments</h1>
                <p className="text-xs text-gray-600 font-semibold">Payment History</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Dashboard
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
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-gray-100 sticky top-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Filters</h3>

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Payment Method</p>
                <div className="space-y-2">
                  {['all', 'cash', 'mpesa', 'card'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setMethodFilter(method as any)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                        methodFilter === method
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {method === 'all' ? 'All Methods' : method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setMethodFilter('all');
                  setSearchTerm('');
                }}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm mb-4"
              >
                Clear Filters
              </button>

              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-black text-gray-900">
                  KES {totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Payment History</h2>
                  {!isLoading && (
                    <p className="text-gray-600">
                      Showing {filteredPayments.length} of {paidOrders.length} payments
                    </p>
                  )}
                </div>
                <div className="w-80">
                  <input
                    type="text"
                    placeholder="Search by order ID, amount, table..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Loading payments...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No payments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((order: any) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order ID</p>
                            <p className="text-2xl font-black text-gray-900">#{order.id}</p>
                          </div>
                          <div className="h-12 w-px bg-gray-300"></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Table</p>
                            <p className="text-lg font-bold text-gray-900">Table {order.tableNumber}</p>
                          </div>
                          <div className="h-12 w-px bg-gray-300"></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Waiter</p>
                            <p className="text-lg font-bold text-gray-900">{order.waiterName}</p>
                          </div>
                          <div className="h-12 w-px bg-gray-300"></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Amount</p>
                            <p className="text-lg font-bold text-gray-900">
                              KES {Number(order.total).toLocaleString()}
                            </p>
                          </div>
                          <div className="h-12 w-px bg-gray-300"></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Method</p>
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-900 text-white">
                              {(order.paymentMethod || 'CASH').toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-900">
                            PAID
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
                        <div>
                          <span className="font-semibold">Time:</span> {new Date(order.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;