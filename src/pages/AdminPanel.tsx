import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, menuItemsAPI, tablesAPI, ordersAPI } from '../services/api';

// Import all menu images
import drinkSoda from '../assets/images/drink-soda.jpg';
import drinkWater from '../assets/images/drink-water.jpg';
import drinkJuice from '../assets/images/drink-juice.jpg';
import drinkCoffee from '../assets/images/drink-coffee.jpg';
import drinkTea from '../assets/images/drink-tea.jpg';

import mealBurger from '../assets/images/meal-burger.jpg';
import mealPizza from '../assets/images/meal-pizza.jpg';
import mealPasta from '../assets/images/meal-pasta.jpg';
import mealSalad from '../assets/images/meal-salad.jpg';
import mealSteak from '../assets/images/meal-steak.jpg';
import mealChicken from '../assets/images/meal-chicken.jpg';
import mealFish from '../assets/images/meal-fish.jpg';

import dessertIcecream from '../assets/images/dessert-icecream.jpg';
import dessertCake from '../assets/images/dessert-cake.jpg';
import dessertCookies from '../assets/images/dessert-cookies.jpg';
import dessertCheesecake from '../assets/images/dessert-cheesecake.jpg';
import dessertBrownies from '../assets/images/dessert-brownies.jpg';

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  active: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
}

interface Order {
  id: number;
  tableNumber: number;
  waiterName: string;
  total: number;
  status: string;
  paymentMethod?: string;
  timestamp: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'menu' | 'tables' | 'orders'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'waiter', active: true });
  const [menuForm, setMenuForm] = useState({ name: '', price: 0, category: 'Drinks', available: true });
  const [tableForm, setTableForm] = useState({ number: 1, seats: 2, status: 'free' });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Map menu item names to images
  const menuImages: { [key: string]: string } = {
    'Soda': drinkSoda,
    'Water': drinkWater,
    'Juice': drinkJuice,
    'Coffee': drinkCoffee,
    'Tea': drinkTea,
    'Burger': mealBurger,
    'Pizza': mealPizza,
    'Pasta': mealPasta,
    'Salad': mealSalad,
    'Steak': mealSteak,
    'Chicken': mealChicken,
    'Fish': mealFish,
    'Ice Cream': dessertIcecream,
    'Cake': dessertCake,
    'Cookies': dessertCookies,
    'Cheesecake': dessertCheesecake,
    'Brownies': dessertBrownies,
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const data = await usersAPI.getAll();
        setUsers(data);
      } else if (activeTab === 'menu') {
        const data = await menuItemsAPI.getAll();
        setMenuItems(data);
      } else if (activeTab === 'tables') {
        const data = await tablesAPI.getAll();
        setTables(data);
      } else if (activeTab === 'orders') {
        const data = await ordersAPI.getAll();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

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
        await usersAPI.createUser(userForm);
      } else if (activeTab === 'menu') {
        await menuItemsAPI.create(menuForm);
      } else if (activeTab === 'tables') {
        await tablesAPI.create(tableForm);
      }
      setShowModal(false);
      fetchData();
      alert('Created successfully!');
    } catch (err) {
      alert('Failed to create');
    }
  };

  const handleUpdate = async () => {
    try {
      if (activeTab === 'users') {
        const updateData = userForm.password ? userForm : { ...userForm, password: undefined };
        await usersAPI.updateUser(selectedItem.id, updateData);
      } else if (activeTab === 'menu') {
        await menuItemsAPI.update(selectedItem.id, menuForm);
      } else if (activeTab === 'tables') {
        await tablesAPI.update(selectedItem.id, tableForm);
      }
      setShowModal(false);
      fetchData();
      alert('Updated successfully!');
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'users') {
        await usersAPI.deleteUser(id);
      } else if (activeTab === 'menu') {
        await menuItemsAPI.delete(id);
      } else if (activeTab === 'tables') {
        await tablesAPI.delete(id);
      }
      fetchData();
      alert('Deleted successfully!');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Username</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{user.id}</td>
              <td className="px-4 py-3 font-semibold">{user.name}</td>
              <td className="px-4 py-3">{user.username}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => openEditModal(user)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMenuTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
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
          {menuItems.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                {menuImages[item.name] && (
                  <img
                    src={menuImages[item.name]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                )}
              </td>
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3 font-semibold">{item.name}</td>
              <td className="px-4 py-3 text-orange-600 font-bold">KES {item.price}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.available ? 'YES' : 'NO'}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTablesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Table Number</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Seats</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{table.id}</td>
              <td className="px-4 py-3 font-semibold">Table {table.number}</td>
              <td className="px-4 py-3">{table.seats}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  table.status === 'free' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {table.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => openEditModal(table)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrdersTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left font-bold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Table</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Waiter</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Total</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Payment</th>
            <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3 font-semibold">Table {order.tableNumber}</td>
              <td className="px-4 py-3">{order.waiterName}</td>
              <td className="px-4 py-3 text-orange-600 font-bold">KES {order.total.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">{order.paymentMethod || '-'}</td>
              <td className="px-4 py-3 text-sm">{new Date(order.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <nav className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">AP</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Admin Panel</h1>
                <p className="text-xs text-purple-600 font-semibold">System Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Dashboard
              </button>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
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
            <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-purple-200 sticky top-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Sections</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    activeTab === 'menu'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Menu Items
                </button>
                <button
                  onClick={() => setActiveTab('tables')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    activeTab === 'tables'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tables
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-900">
                  {activeTab === 'users' && 'Users Management'}
                  {activeTab === 'menu' && 'Menu Items Management'}
                  {activeTab === 'tables' && 'Tables Management'}
                  {activeTab === 'orders' && 'Orders Overview'}
                </h2>
                {activeTab !== 'orders' && (
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                  >
                    + Create New
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Loading...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'users' && renderUsersTable()}
                  {activeTab === 'menu' && renderMenuTable()}
                  {activeTab === 'tables' && renderTablesTable()}
                  {activeTab === 'orders' && renderOrdersTable()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price (KES)</label>
                  <input
                    type="number"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Seats</label>
                  <input
                    type="number"
                    value={tableForm.seats}
                    onChange={(e) => setTableForm({ ...tableForm, seats: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={tableForm.status}
                    onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
              >
                {modalMode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;