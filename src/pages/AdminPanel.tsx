// src/pages/AdminPanel.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetTablesQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useGetOrdersQuery,
  useGetPaymentsQuery,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from '../app/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Import DRINKS images
import cappuccino from '../assets/images/cappuccino.jpg';
import espresso from '../assets/images/espresso.jpg';
import latte from '../assets/images/latte.jpg';
import freshOrangeJuice from '../assets/images/fresh-orange-juice.jpg';
import mineralWater from '../assets/images/mineral-water.jpg';
import soda from '../assets/images/soda.jpg';

// Import MEALS images
import beefBurger from '../assets/images/beef-burger.jpg';
import chickenWrap from '../assets/images/chicken-wrap.jpg';
import caesarSalad from '../assets/images/caesar-salad.jpg';
import pastaCarbonara from '../assets/images/pasta-carbonara.jpg';
import grilledFishChips from '../assets/images/grilled-fish-chips.jpg';
import steakVegetables from '../assets/images/steak-vegetables.jpg';
import chickenTikka from '../assets/images/chicken-tikka.jpg';

// Import DESSERTS images
import chocolateCake from '../assets/images/chocolate-cake.jpg';
import vanillaIceCream from '../assets/images/vanilla-ice-cream.jpg';
import cheesecake from '../assets/images/cheesecake.jpg';
import fruitSalad from '../assets/images/fruit-salad.jpg';

type ActiveTab = 'dashboard' | 'users' | 'menu' | 'tables' | 'orders' | 'analytics' | 'payments' | 'expenses';

interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
}

interface Order {
  id: number;
  tableId: number;
  tableNumber: number;
  waiterId: number;
  waiterName: string;
  items: string;
  total: number;
  status: string;
  paymentMethod?: string;
  timestamp: Date;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'waiter', active: true });
  const [menuForm, setMenuForm] = useState({ name: '', price: 0, category: 'Drinks', available: true });
  const [tableForm, setTableForm] = useState({ number: 1, seats: 2, status: 'free' });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ FIXED: Always fetch data (removed skip conditions for dashboard)
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery(undefined);
  const { data: menuItems = [], isLoading: menuLoading } = useGetMenuItemsQuery(undefined);
  const { data: tables = [], isLoading: tablesLoading } = useGetTablesQuery(undefined);
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery(undefined);
  const { data: payments = [], isLoading: paymentsLoading } = useGetPaymentsQuery(undefined);
  const { data: expenses = [], isLoading: expensesLoading } = useGetExpensesQuery(undefined);

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [createTable] = useCreateTableMutation();
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const menuImages: { [key: string]: string } = {
    'Cappuccino': cappuccino,
    'Espresso': espresso,
    'Latte': latte,
    'Fresh Orange Juice': freshOrangeJuice,
    'Mineral Water': mineralWater,
    'Soda': soda,
    'Beef Burger': beefBurger,
    'Chicken Wrap': chickenWrap,
    'Caesar Salad': caesarSalad,
    'Pasta Carbonara': pastaCarbonara,
    'Grilled Fish & Chips': grilledFishChips,
    'Steak & Vegetables': steakVegetables,
    'Chicken Tikka': chickenTikka,
    'Chocolate Cake': chocolateCake,
    'Vanilla Ice Cream': vanillaIceCream,
    'Cheesecake': cheesecake,
    'Fruit Salad': fruitSalad,
  };

  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedItem(null);
    setUserForm({ name: '', username: '', password: '', role: 'waiter', active: true });
    setMenuForm({ name: '', price: 0, category: 'Drinks', available: true });
    setTableForm({ number: 1, seats: 2, status: 'free' });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    if (activeTab === 'users') {
      setUserForm({ name: item.name, username: item.username, password: '', role: item.role, active: item.active });
    } else if (activeTab === 'menu') {
      setMenuForm({ name: item.name, price: item.price, category: item.category, available: item.available });
    } else if (activeTab === 'tables') {
      setTableForm({ number: item.number, seats: item.seats, status: item.status });
    }
    setShowModal(true);
  };

  const handleCreate = async () => {
    try {
      if (activeTab === 'users') {
        await createUser(userForm).unwrap();
      } else if (activeTab === 'menu') {
        await createMenuItem(menuForm).unwrap();
      } else if (activeTab === 'tables') {
        await createTable(tableForm).unwrap();
      }
      setShowModal(false);
      alert('Created successfully!');
    } catch (err) {
      alert('Failed to create');
    }
  };

  const handleUpdate = async () => {
    try {
      if (activeTab === 'users') {
        const updateData = userForm.password ? userForm : { ...userForm, password: undefined };
        await updateUser({ id: selectedItem.id, data: updateData }).unwrap();
      } else if (activeTab === 'menu') {
        await updateMenuItem({ id: selectedItem.id, data: menuForm }).unwrap();
      } else if (activeTab === 'tables') {
        await updateTable({ id: selectedItem.id, data: tableForm }).unwrap();
      }
      setShowModal(false);
      alert('Updated successfully!');
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'users') {
        await deleteUser(id).unwrap();
      } else if (activeTab === 'menu') {
        await deleteMenuItem(id).unwrap();
      } else if (activeTab === 'tables') {
        await deleteTable(id).unwrap();
      }
      alert('Deleted successfully!');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleApproveExpense = async (id: number) => {
    try {
      await updateExpense({
        id,
        data: { status: 'approved', approvedBy: user?.name },
      }).unwrap();
      alert('Expense approved!');
    } catch (err) {
      alert('Failed to approve expense');
    }
  };

  const handleRejectExpense = async (id: number) => {
    try {
      await updateExpense({
        id,
        data: { status: 'rejected' },
      }).unwrap();
      alert('Expense rejected!');
    } catch (err) {
      alert('Failed to reject expense');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteExpense(id).unwrap();
      alert('Expense deleted!');
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    return {
      availableTables: tables.filter((t: Table) => t.status === 'free').length,
      activeOrders: orders.filter((o: Order) => o.status === 'open').length,
      completedOrders: orders.filter((o: Order) => o.status === 'paid').length,
      totalTables: tables.length,
      totalUsers: users.length,
      totalMenuItems: menuItems.length,
    };
  }, [tables, orders, users, menuItems]);

  // Analytics calculations
  const analyticsData = useMemo(() => {
    const totalRevenue = payments
      .filter((p: any) => p.status === 'completed')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    const totalExpenses = expenses
      .filter((e: any) => e.status === 'approved')
      .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    const totalOrders = orders.length;
    const paidOrders = orders.filter((o: any) => o.status === 'paid').length;
    const openOrders = orders.filter((o: any) => o.status === 'open').length;

    // Revenue by payment method
    const revenueByMethod = payments
      .filter((p: any) => p.status === 'completed')
      .reduce((acc: any, p: any) => {
        acc[p.method] = (acc[p.method] || 0) + Number(p.amount);
        return acc;
      }, {});

    const paymentMethodData = Object.keys(revenueByMethod).map((method) => ({
      name: method.toUpperCase(),
      value: revenueByMethod[method],
    }));

    // Top products
    const itemCounts: { [key: string]: { count: number; revenue: number } } = {};
    orders.forEach((order: any) => {
      try {
        const items = JSON.parse(order.items);
        items.forEach((item: any) => {
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { count: 0, revenue: 0 };
          }
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += item.price * item.quantity;
        });
      } catch (e) {
        // Skip invalid JSON
      }
    });

    const topProducts = Object.entries(itemCounts)
      .map(([name, data]) => ({
        name,
        quantity: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Orders trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const ordersTrend = last7Days.map((date) => {
      const dayOrders = orders.filter((o: any) => {
        const orderDate = new Date(o.timestamp).toISOString().split('T')[0];
        return orderDate === date;
      });
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o: any) => o.status === 'paid')
          .reduce((sum: number, o: any) => sum + Number(o.total), 0),
      };
    });

    // Category performance
    const categoryPerformance: { [key: string]: number } = {};
    menuItems.forEach((item: any) => {
      const itemData = itemCounts[item.name];
      if (itemData) {
        categoryPerformance[item.category] = (categoryPerformance[item.category] || 0) + itemData.revenue;
      }
    });

    const categoryData = Object.entries(categoryPerformance).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      totalOrders,
      paidOrders,
      openOrders,
      averageOrderValue: paidOrders > 0 ? totalRevenue / paidOrders : 0,
      paymentMethodData,
      topProducts,
      ordersTrend,
      categoryData,
    };
  }, [orders, payments, expenses, menuItems]);

  const loading = usersLoading || menuLoading || tablesLoading || ordersLoading || paymentsLoading || expensesLoading;

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  const COLORS = ['#111827', '#374151', '#6B7280', '#9CA3AF'];

  // Render Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <p className="text-gray-600 font-semibold mb-2">Available Tables</p>
          <p className="text-4xl font-black text-gray-900">{dashboardStats.availableTables}</p>
          <p className="text-sm text-gray-500 mt-1">of {dashboardStats.totalTables} total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <p className="text-gray-600 font-semibold mb-2">Active Orders</p>
          <p className="text-4xl font-black text-gray-900">{dashboardStats.activeOrders}</p>
          <p className="text-sm text-gray-500 mt-1">currently processing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
        >
          <p className="text-gray-600 font-semibold mb-2">Completed Orders</p>
          <p className="text-4xl font-black text-gray-900">{dashboardStats.completedOrders}</p>
          <p className="text-sm text-gray-500 mt-1">successfully paid</p>
        </motion.div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('users')}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-gray-900 transition text-left"
          >
            <h4 className="text-lg font-black text-gray-900 mb-2">Users</h4>
            <p className="text-3xl font-black text-gray-900 mb-1">{dashboardStats.totalUsers}</p>
            <p className="text-gray-600 text-sm">Manage users</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('menu')}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-gray-900 transition text-left"
          >
            <h4 className="text-lg font-black text-gray-900 mb-2">Menu Items</h4>
            <p className="text-3xl font-black text-gray-900 mb-1">{dashboardStats.totalMenuItems}</p>
            <p className="text-gray-600 text-sm">Manage menu</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('tables')}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-gray-900 transition text-left"
          >
            <h4 className="text-lg font-black text-gray-900 mb-2">Tables</h4>
            <p className="text-3xl font-black text-gray-900 mb-1">{dashboardStats.totalTables}</p>
            <p className="text-gray-600 text-sm">Manage tables</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('analytics')}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100 hover:border-green-600 transition text-left"
          >
            <h4 className="text-lg font-black text-green-600 mb-2">Analytics</h4>
            <p className="text-3xl font-black text-gray-900 mb-1">KES {analyticsData.totalRevenue.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">View reports</p>
          </motion.button>
        </div>
      </div>

      {/* System Overview & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Orders</span>
              <span className="text-gray-900 font-bold">{orders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-gray-900 font-bold">KES {analyticsData.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="text-gray-900 font-bold">KES {analyticsData.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
              <span className="text-gray-600 font-bold">Net Profit</span>
              <span className={`font-black text-lg ${analyticsData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KES {analyticsData.netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="text-gray-900 font-bold">{users.filter((u: any) => u.active).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Menu Items</span>
              <span className="text-gray-900 font-bold">{menuItems.filter((m: any) => m.available).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Open Orders</span>
              <span className="text-gray-900 font-bold">{analyticsData.openOrders}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
              <span className="text-gray-600 font-bold">Avg Order Value</span>
              <span className="text-gray-900 font-black text-lg">KES {analyticsData.averageOrderValue.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ... continuing from Part 1

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Username</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: number) => (
            <motion.tr
              key={user.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="border-b"
            >
              <td className="px-4 py-3">{user.id}</td>
              <td className="px-4 py-3 font-semibold">{user.name}</td>
              <td className="px-4 py-3">{user.username}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin' ? 'bg-gray-900 text-white' :
                  user.role === 'manager' ? 'bg-gray-700 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.active ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {user.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-4 py-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEditModal(user)}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 mr-2 text-sm font-semibold"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
                >
                  Delete
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMenuTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-bold text-gray-700">Image</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Price</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Available</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item: any, index: number) => (
            <motion.tr
              key={item.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="border-b"
            >
              <td className="px-4 py-3">
                {menuImages[item.name] && (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={menuImages[item.name]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                )}
              </td>
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3 font-semibold">{item.name}</td>
              <td className="px-4 py-3 text-gray-900 font-bold">KES {item.price}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.available ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.available ? 'YES' : 'NO'}
                </span>
              </td>
              <td className="px-4 py-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 mr-2 text-sm font-semibold"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
                >
                  Delete
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTablesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Table Number</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Seats</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table: any, index: number) => (
            <motion.tr
              key={table.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="border-b"
            >
              <td className="px-4 py-3">{table.id}</td>
              <td className="px-4 py-3 font-semibold">Table {table.number}</td>
              <td className="px-4 py-3">{table.seats}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  table.status === 'free' ? 'bg-gray-900 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {table.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEditModal(table)}
                  className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 mr-2 text-sm font-semibold"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(table.id)}
                  className="px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
                >
                  Delete
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrdersTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Table</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Waiter</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Total</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Payment</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, index: number) => (
            <motion.tr
              key={order.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="border-b"
            >
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3 font-semibold">Table {order.tableNumber}</td>
              <td className="px-4 py-3">{order.waiterName}</td>
              <td className="px-4 py-3 text-gray-900 font-bold">KES {order.total.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'paid' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">{order.paymentMethod || '-'}</td>
              <td className="px-4 py-3 text-sm">{new Date(order.timestamp).toLocaleString()}</td>
              <td className="px-4 py-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
                >
                  View Details
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-xl"
        >
          <p className="text-sm font-semibold mb-2 opacity-80">Total Revenue</p>
          <p className="text-3xl font-black">KES {analyticsData.totalRevenue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-6 text-white shadow-xl"
        >
          <p className="text-sm font-semibold mb-2 opacity-80">Net Profit</p>
          <p className="text-3xl font-black">KES {analyticsData.netProfit.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow-xl"
        >
          <p className="text-sm font-semibold mb-2 opacity-80">Total Orders</p>
          <p className="text-3xl font-black">{analyticsData.totalOrders}</p>
          <p className="text-xs mt-1 opacity-80">{analyticsData.paidOrders} paid, {analyticsData.openOrders} open</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl p-6 text-white shadow-xl"
        >
          <p className="text-sm font-semibold mb-2 opacity-80">Avg Order Value</p>
          <p className="text-3xl font-black">KES {analyticsData.averageOrderValue.toFixed(0)}</p>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-xl border-2 border-gray-100"
        >
          <h3 className="text-xl font-black text-gray-900 mb-4">Order Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.ordersTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#111827" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue (KES)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by Payment Method */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-xl border-2 border-gray-100"
        >
          <h3 className="text-xl font-black text-gray-900 mb-4">Revenue by Payment Method</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: KES ${value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.paymentMethodData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-xl border-2 border-gray-100"
        >
          <h3 className="text-xl font-black text-gray-900 mb-4">Top 10 Products by Quantity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantity" fill="#111827" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-xl border-2 border-gray-100"
        >
          <h3 className="text-xl font-black text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#374151" name="Revenue (KES)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-xl border-2 border-gray-100"
      >
        <h3 className="text-xl font-black text-gray-900 mb-4">Best Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-bold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Quantity Sold</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((product: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3">{product.quantity}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">KES {product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderPayments = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Order ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Amount</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Method</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Transaction ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any, index: number) => (
            <motion.tr
              key={payment.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="border-b"
            >
              <td className="px-4 py-3">{payment.id}</td>
              <td className="px-4 py-3 font-semibold">#{payment.orderId}</td>
              <td className="px-4 py-3 font-bold text-gray-900">KES {Number(payment.amount).toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white">
                  {payment.method.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-900' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-900' :
                  'bg-red-100 text-red-900'
                }`}>
                  {payment.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">{payment.transactionId || '-'}</td>
              <td className="px-4 py-3 text-sm">{new Date(payment.timestamp).toLocaleString()}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderExpenses = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Description</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Amount</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Submitted By</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense: any, index: number) => (
            <motion.tr
              key={expense.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="border-b"
            >
              <td className="px-4 py-3">{expense.id}</td>
              <td className="px-4 py-3 font-semibold">{expense.description}</td>
              <td className="px-4 py-3 font-bold text-gray-900">KES {Number(expense.amount).toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white">
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  expense.status === 'approved' ? 'bg-green-100 text-green-900' :
                  expense.status === 'pending' ? 'bg-yellow-100 text-yellow-900' :
                  'bg-red-100 text-red-900'
                }`}>
                  {expense.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">{expense.submittedBy}</td>
              <td className="px-4 py-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {expense.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveExpense(expense.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRejectExpense(expense.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                      >
                        Reject
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

 // ... continuing from Part 2

  // Sidebar menu items
  const sidebarItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard' },
    { id: 'users' as ActiveTab, label: 'Users' },
    { id: 'menu' as ActiveTab, label: 'Menu Items' },
    { id: 'tables' as ActiveTab, label: 'Tables' },
    { id: 'orders' as ActiveTab, label: 'Orders' },
    { id: 'analytics' as ActiveTab, label: 'Analytics' },
    { id: 'payments' as ActiveTab, label: 'Payments' },
    { id: 'expenses' as ActiveTab, label: 'Expenses' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - ✅ REMOVED "Back to Main" button */}
      <nav className="bg-white shadow-lg border-b-2 border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">AP</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-600 font-semibold">System Management</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
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

      <div className="flex">
        {/* Permanent Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-64 bg-gray-900 min-h-screen shadow-2xl"
        >
          <div className="p-6">
            <h2 className="text-white font-black text-lg mb-6">Menu</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    activeTab === item.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'users' && 'Users Management'}
                {activeTab === 'menu' && 'Menu Items Management'}
                {activeTab === 'tables' && 'Tables Management'}
                {activeTab === 'orders' && 'Orders Overview'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'payments' && 'Payment History'}
                {activeTab === 'expenses' && 'Expense Management'}
              </h2>
              {/* Show Create button only for users, menu, tables */}
              {(activeTab === 'users' || activeTab === 'menu' || activeTab === 'tables') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openCreateModal}
                  className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                  + Create New
                </motion.button>
              )}
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">Loading...</p>
              </motion.div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'users' && renderUsersTable()}
                {activeTab === 'menu' && renderMenuTable()}
                {activeTab === 'tables' && renderTablesTable()}
                {activeTab === 'orders' && renderOrdersTable()}
                {activeTab === 'analytics' && renderAnalytics()}
                {activeTab === 'payments' && renderPayments()}
                {activeTab === 'expenses' && renderExpenses()}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {modalMode === 'create' ? 'Create New' : 'Edit'}{' '}
                {activeTab === 'users' ? 'User' : activeTab === 'menu' ? 'Menu Item' : 'Table'}
              </h2>

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password {modalMode === 'edit' && '(leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    >
                      <option value="waiter">Waiter</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={userForm.active}
                      onChange={(e) => setUserForm({ ...userForm, active: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label className="text-sm font-bold text-gray-700">Active</label>
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (KES)</label>
                    <input
                      type="number"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select
                      value={menuForm.category}
                      onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    >
                      <option value="Drinks">Drinks</option>
                      <option value="Meals">Meals</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={menuForm.available}
                      onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label className="text-sm font-bold text-gray-700">Available</label>
                  </div>
                </div>
              )}

              {activeTab === 'tables' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Table Number</label>
                    <input
                      type="number"
                      value={tableForm.number}
                      onChange={(e) => setTableForm({ ...tableForm, number: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Seats</label>
                    <input
                      type="number"
                      value={tableForm.seats}
                      onChange={(e) => setTableForm({ ...tableForm, seats: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                    <select
                      value={tableForm.status}
                      onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:border-gray-900 focus:outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;