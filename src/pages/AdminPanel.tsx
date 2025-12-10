// src/pages/AdminPanel.tsx

import React, { useState } from 'react';
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
} from '../app/services/api';
import { motion, AnimatePresence } from 'framer-motion';

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

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'menu' | 'tables' | 'orders'>('users');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'waiter', active: true });
  const [menuForm, setMenuForm] = useState({ name: '', price: 0, category: 'Drinks', available: true });
  const [tableForm, setTableForm] = useState({ number: 1, seats: 2, status: 'free' });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery(undefined, { skip: activeTab !== 'users' });
  const { data: menuItems = [], isLoading: menuLoading } = useGetMenuItemsQuery(undefined, { skip: activeTab !== 'menu' });
  const { data: tables = [], isLoading: tablesLoading } = useGetTablesQuery(undefined, { skip: activeTab !== 'tables' });
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery(undefined, { skip: activeTab !== 'orders' });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [createTable] = useCreateTableMutation();
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

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

  const loading = usersLoading || menuLoading || tablesLoading || ordersLoading;

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

  // ✅ UPDATED: Orders table now VIEW-ONLY with "View Details" button
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
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-4 border-2 border-gray-100 sticky top-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Sections</h3>
              <div className="space-y-2">
                {['users', 'menu', 'tables', 'orders'].map((tab, index) => (
                  <motion.button
                    key={tab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab as any)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                      activeTab === tab
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'users' ? 'Users' : tab === 'menu' ? 'Menu Items' : tab === 'tables' ? 'Tables' : 'Orders'}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="col-span-10">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-900">
                  {activeTab === 'users' && 'Users Management'}
                  {activeTab === 'menu' && 'Menu Items Management'}
                  {activeTab === 'tables' && 'Tables Management'}
                  {activeTab === 'orders' && 'Orders Overview'}
                </h2>
                {/* ✅ UPDATED: Hide "Create New" button for Orders tab */}
                {activeTab !== 'orders' && (
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
                  {activeTab === 'users' && renderUsersTable()}
                  {activeTab === 'menu' && renderMenuTable()}
                  {activeTab === 'tables' && renderTablesTable()}
                  {activeTab === 'orders' && renderOrdersTable()}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

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