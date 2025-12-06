import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetOrdersQuery } from '../app/services/api'; 


const Orders: React.FC = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading orders...</div>
      </div>
    );
  }

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
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      statusFilter === 'all'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Orders
                  </button>
                  <button
                    onClick={() => setStatusFilter('open')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      statusFilter === 'open'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setStatusFilter('paid')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      statusFilter === 'paid'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Payment</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentFilter('all')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      paymentFilter === 'all'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Methods
                  </button>
                  <button
                    onClick={() => setPaymentFilter('cash')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      paymentFilter === 'cash'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentFilter('mpesa')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      paymentFilter === 'mpesa'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentFilter('card')}
                    className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                      paymentFilter === 'card'
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Card
                  </button>
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
                  <p className="text-gray-600">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </p>
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

              {filteredOrders.length === 0 ? (
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
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:shadow-lg transition cursor-pointer"
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