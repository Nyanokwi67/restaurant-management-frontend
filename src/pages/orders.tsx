import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetOrdersQuery } from '../app/services/api';

const Orders: React.FC = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery(undefined);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'paid'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'mpesa' | 'card'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => {
        const payment = order.paymentMethod?.toLowerCase();
        return payment === paymentFilter;
      });
    }

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      
      filtered = filtered.filter(order => {
        const orderId = String(order.id);
        const tableNum = String(order.tableNumber);
        const waiterName = order.waiterName ? order.waiterName.toLowerCase() : '';
        const totalAmount = String(order.total);
        const paymentMethod = order.paymentMethod ? order.paymentMethod.toLowerCase() : '';
        
        const matchesId = orderId.includes(searchLower);
        const matchesTable = tableNum.includes(searchLower) || `table ${tableNum}`.includes(searchLower);
        const matchesWaiter = waiterName.includes(searchLower);
        const matchesTotal = totalAmount.includes(searchLower);
        const matchesPayment = paymentMethod.includes(searchLower);
        
        return matchesId || matchesTable || matchesWaiter || matchesTotal || matchesPayment;
      });
    }

    return filtered;
  }, [orders, statusFilter, paymentFilter, searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              <div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 bg-gray-300 rounded-full"></div>
              <div className="h-10 w-28 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Failed to load orders</p>
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
                <h1 className="text-xl font-black text-gray-900">Orders</h1>
                <p className="text-xs text-gray-600 font-semibold">All Orders</p>
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
                <p className="text-sm font-bold text-gray-700 mb-2">Status</p>
                <div className="space-y-2">
                  {['all', 'open', 'paid'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                        statusFilter === status
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Payment</p>
                <div className="space-y-2">
                  {['all', 'cash', 'mpesa', 'card'].map((payment) => (
                    <button
                      key={payment}
                      onClick={() => setPaymentFilter(payment as any)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                        paymentFilter === payment
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {payment === 'all' ? 'All Methods' : payment.charAt(0).toUpperCase() + payment.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setSearchTerm('');
                }}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="col-span-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">All Orders</h2>
                  {!isLoading && (
                    <p className="text-gray-600">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                  )}
                </div>
                <div className="w-80">
                  <input
                    type="text"
                    placeholder="Search by ID, table, waiter, amount, payment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
                  />
                  {searchTerm && (
                    <p className="text-xs text-gray-500 mt-1">
                      Searching for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </div>

              {isLoading ? (
                <SkeletonLoader />
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No orders found</p>
                  {searchTerm && (
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Search term: "{searchTerm}"</p>
                      <p>Try different keywords or clear filters</p>
                    </div>
                  )}
                  {(statusFilter !== 'all' || paymentFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setPaymentFilter('all');
                        setSearchTerm('');
                      }}
                      className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:shadow-lg hover:scale-[1.01] transition cursor-pointer"
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
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="text-lg font-bold text-gray-900">
                              KES {order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-bold ${
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
                              <p className="text-xs text-gray-500">Payment</p>
                              <p className="text-sm font-bold text-gray-900">
                                {order.paymentMethod.toUpperCase()}
                              </p>
                            </div>
                          )}
                          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold">
                            View Details
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        {new Date(order.timestamp).toLocaleString()}
                      </div>
                    </div>
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

export default Orders;