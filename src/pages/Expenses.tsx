import { useState, useMemo, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from '../app/services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
  id: number;
  description: string;
  amount: number | string;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  approvedBy?: string;
}

const Expenses: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: expenses = [], isLoading, error } = useGetExpensesQuery(undefined);
  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Inventory' | 'Utilities' | 'Salaries' | 'Maintenance' | 'Other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Inventory',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = useMemo(() => {
    let filtered: Expense[] = [...(expenses as Expense[])];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        expense.submittedBy.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, categoryFilter, statusFilter, searchTerm]);

  const totalAmount = useMemo(() => {
    return filteredExpenses
      .filter(e => e.status === 'approved')
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [filteredExpenses]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createExpense({
        description: formData.description,
        amount: Number(formData.amount),
        category: formData.category,
        submittedBy: user.name,
        date: formData.date,
      }).unwrap();

      alert('Expense created successfully!');
      setShowCreateModal(false);
      setFormData({
        description: '',
        amount: '',
        category: 'Inventory',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Create expense error:', err);
      alert('Failed to create expense');
    }
  };

  const handleApprove = async (id: number) => {
    if (!user) return;

    try {
      console.log('🔵 Approving expense:', id);
      
      // Backend sets approvedBy automatically from JWT token
      await updateExpense({
        id,
        status: 'approved',
      }).unwrap();

      console.log('✅ Expense approved successfully');
      alert('Expense approved!');
    } catch (err: any) {
      console.error('❌ Approve error:', err);
      console.error('❌ Error data:', err?.data);
      
      const errorMessage = err?.data?.message || err?.data?.error || 'Failed to approve expense';
      alert(`Failed to approve expense: ${errorMessage}`);
    }
  };

  const handleReject = async (id: number) => {
    try {
      console.log('🔵 Rejecting expense:', id);
      
      await updateExpense({
        id,
        status: 'rejected',
      }).unwrap();

      console.log('✅ Expense rejected successfully');
      alert('Expense rejected!');
    } catch (err: any) {
      console.error('❌ Reject error:', err);
      console.error('❌ Error data:', err?.data);
      
      const errorMessage = err?.data?.message || err?.data?.error || 'Failed to reject expense';
      alert(`Failed to reject expense: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteExpense(id).unwrap();
      alert('Expense deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete expense');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Failed to load expenses</p>
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
                <h1 className="text-xl font-black text-gray-900">Expenses</h1>
                <p className="text-xs text-gray-600 font-semibold">Expense Management</p>
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
                <p className="text-sm font-bold text-gray-700 mb-2">Category</p>
                <div className="space-y-2">
                  {['all', 'Inventory', 'Utilities', 'Salaries', 'Maintenance', 'Other'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category as any)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                        categoryFilter === category
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Status</p>
                <div className="space-y-2">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold transition text-left text-sm ${
                        statusFilter === status
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm mb-4"
              >
                Clear Filters
              </button>

              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                <p className="text-xs text-gray-600 mb-1">Total Approved</p>
                <p className="text-2xl font-black text-gray-900">
                  KES {totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {filteredExpenses.filter(e => e.status === 'approved').length} expenses
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">All Expenses</h2>
                  {!isLoading && (
                    <p className="text-gray-600">
                      Showing {filteredExpenses.length} of {expenses.length} expenses
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
                  />
                  {user?.role === 'manager' && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
                    >
                      Add Expense
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Loading expenses...</p>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No expenses found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-black text-gray-900">
                              {expense.description}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              expense.status === 'approved'
                                ? 'bg-green-100 text-green-900'
                                : expense.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-900'
                                : 'bg-red-100 text-red-900'
                            }`}>
                              {expense.status.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white">
                              {expense.category}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="text-lg font-bold text-gray-900">
                                KES {Number(expense.amount).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Submitted By</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {expense.submittedBy}
                              </p>
                            </div>
                            {expense.approvedBy && (
                              <div>
                                <p className="text-xs text-gray-500">Approved By</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {expense.approvedBy}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {expense.status === 'pending' && user?.role === 'admin' && (
                            <>
                              <button
                                onClick={() => handleApprove(expense.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(expense.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm"
                            >
                              Delete
                            </button>
                          )}
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

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Expense</h2>

              <form onSubmit={handleCreateExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    placeholder="e.g., Weekly vegetable purchase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    >
                      <option value="Inventory">Inventory</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                  >
                    Create Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expenses;