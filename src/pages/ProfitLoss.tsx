// src/pages/ProfitLoss.tsx - Create this new file

import { useState, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useGetOrdersQuery,
  useGetExpensesQuery,
  useGetPaymentsQuery,
} from '../app/services/api';
import { motion } from 'framer-motion';

interface DateRange {
  start: string;
  end: string;
}

const ProfitLoss: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: orders = [] } = useGetOrdersQuery(undefined);
  const { data: expenses = [] } = useGetExpensesQuery(undefined);
  const { data: payments = [] } = useGetPaymentsQuery(undefined);

  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const financialData = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    // Calculate total income from completed/paid orders
    const paidOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.timestamp);
      return (
        order.status === 'paid' &&
        orderDate >= startDate &&
        orderDate <= endDate
      );
    });

    // DEBUG: Log what we're counting
    console.log(' P&L Debug - Paid Orders:', paidOrders);
    console.log(' P&L Debug - Total Orders Count:', paidOrders.length);
    console.log(' P&L Debug - Order Statuses:', orders.map((o: any) => ({ id: o.id, status: o.status, total: o.total })));

    const totalIncome = paidOrders.reduce((sum: number, order: any) => sum + Number(order.total), 0);

    // Calculate total expenses (approved only)
    const totalExpenses = expenses
      .filter((expense: any) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.status === 'approved' &&
          expenseDate >= startDate &&
          expenseDate <= endDate
        );
      })
      .reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);

    // Calculate net profit/loss
    const netProfitLoss = totalIncome - totalExpenses;

    // Expense breakdown by category
    const expensesByCategory = expenses
      .filter((expense: any) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.status === 'approved' &&
          expenseDate >= startDate &&
          expenseDate <= endDate
        );
      })
      .reduce((acc: any, expense: any) => {
        const category = expense.category;
        acc[category] = (acc[category] || 0) + Number(expense.amount);
        return acc;
      }, {});

    // Count of orders and expenses
    const orderCount = orders.filter((order: any) => {
      const orderDate = new Date(order.timestamp);
      return order.status === 'paid' && orderDate >= startDate && orderDate <= endDate;
    }).length;

    const expenseCount = expenses.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      return expense.status === 'approved' && expenseDate >= startDate && expenseDate <= endDate;
    }).length;

    return {
      totalIncome,
      totalExpenses,
      netProfitLoss,
      expensesByCategory,
      orderCount,
      expenseCount,
      profitMargin: totalIncome > 0 ? ((netProfitLoss / totalIncome) * 100).toFixed(1) : 0,
    };
  }, [orders, expenses, dateRange]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const setQuickDateRange = (range: 'today' | 'week' | 'month' | 'year') => {
    const today = new Date();
    let start = new Date();

    switch (range) {
      case 'today':
        start = new Date(today);
        break;
      case 'week':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        break;
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    });
  };

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
                <h1 className="text-xl font-black text-gray-900">Profit & Loss</h1>
                <p className="text-xs text-gray-600 font-semibold">Financial Overview</p>
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
        {/* Date Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 mb-6"
        >
          <h2 className="text-xl font-black text-gray-900 mb-4">Date Range</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex gap-2">
              {['today', 'week', 'month', 'year'].map((range, index) => (
                <motion.button
                  key={range}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuickDateRange(range as any)}
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                >
                  {range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : range === 'month' ? 'This Month' : 'This Year'}
                </motion.button>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-2 items-center"
            >
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
              />
              <span className="text-gray-600 font-bold">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <p className="text-sm text-gray-600 font-semibold mb-2">Total Income</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-3xl font-black text-green-600"
            >
              KES {financialData.totalIncome.toLocaleString()}
            </motion.p>
            <p className="text-xs text-gray-500 mt-2">{financialData.orderCount} paid orders</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <p className="text-sm text-gray-600 font-semibold mb-2">Total Expenses</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="text-3xl font-black text-red-600"
            >
              KES {financialData.totalExpenses.toLocaleString()}
            </motion.p>
            <p className="text-xs text-gray-500 mt-2">{financialData.expenseCount} approved expenses</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className={`bg-white rounded-2xl shadow-xl p-6 border-2 ${
              financialData.netProfitLoss >= 0 ? 'border-green-200' : 'border-red-200'
            }`}
          >
            <p className="text-sm text-gray-600 font-semibold mb-2">Net Profit/Loss</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
              className={`text-3xl font-black ${
                financialData.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              KES {financialData.netProfitLoss.toLocaleString()}
            </motion.p>
            <p className="text-xs text-gray-500 mt-2">
              {financialData.netProfitLoss >= 0 ? 'Profit' : 'Loss'}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <p className="text-sm text-gray-600 font-semibold mb-2">Profit Margin</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              className={`text-3xl font-black ${
                Number(financialData.profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {financialData.profitMargin}%
            </motion.p>
            <p className="text-xs text-gray-500 mt-2">Net margin</p>
          </motion.div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6">Expense Breakdown by Category</h2>
          
          {Object.keys(financialData.expensesByCategory).length === 0 ? (
            <p className="text-center text-gray-500 py-8">No expenses in this period</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(financialData.expensesByCategory).map(([category, amount]: [string, any]) => {
                const percentage = financialData.totalExpenses > 0 
                  ? ((amount / financialData.totalExpenses) * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={category} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white">
                          {category}
                        </span>
                        <span className="text-sm text-gray-600">{percentage}% of total expenses</span>
                      </div>
                      <p className="text-xl font-black text-gray-900">
                        KES {amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Summary Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-2xl shadow-xl p-8 border-2 border-gray-800 mt-6 text-white"
        >
          <h2 className="text-2xl font-black mb-4">Financial Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="font-semibold">Total Revenue</span>
              <span className="font-black text-xl">KES {financialData.totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="font-semibold">Total Expenses</span>
              <span className="font-black text-xl">- KES {financialData.totalExpenses.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center pt-2 ${
              financialData.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="font-black text-lg">Net {financialData.netProfitLoss >= 0 ? 'Profit' : 'Loss'}</span>
              <span className="font-black text-2xl">
                KES {Math.abs(financialData.netProfitLoss).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfitLoss;