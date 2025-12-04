import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, menuItemsAPI, tablesAPI, ordersAPI } from '../services/api';

type Tab = 'users' | 'menu' | 'tables' | 'orders';

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
  timestamp: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'waiter', active: true });
  const [menuForm, setMenuForm] = useState({ name: '', price: 0, category: 'Meals', available: true });
  const [tableForm, setTableForm] = useState({ number: 0, seats: 2, status: 'free' });

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
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User CRUD
  const handleCreateUser = async () => {
    try {
      await usersAPI.createUser(userForm);
      alert('User created successfully!');
      setShowModal(false);
      fetchData();
      setUserForm({ name: '', username: '', password: '', role: 'waiter', active: true });
    } catch (err) {
      alert('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await usersAPI.updateUser(selectedItem.id, userForm);
      alert('User updated successfully!');
      setShowModal(false);
      fetchData();
      setUserForm({ name: '', username: '', password: '', role: 'waiter', active: true });
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.deleteUser(id);
      alert('User deleted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Menu Item CRUD
  const handleCreateMenuItem = async () => {
    try {
      await menuItemsAPI.create(menuForm);
      alert('Menu item created successfully!');
      setShowModal(false);
      fetchData();
      setMenuForm({ name: '', price: 0, category: 'Meals', available: true });
    } catch (err) {
      alert('Failed to create menu item');
    }
  };

  const handleUpdateMenuItem = async () => {
    try {
      await menuItemsAPI.update(selectedItem.id, menuForm);
      alert('Menu item updated successfully!');
      setShowModal(false);
      fetchData();
      setMenuForm({ name: '', price: 0, category: 'Meals', available: true });
    } catch (err) {
      alert('Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await menuItemsAPI.delete(id);
      alert('Menu item deleted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to delete menu item');
    }
  };

  // Table CRUD
  const handleCreateTable = async () => {
    try {
      await tablesAPI.create(tableForm);
      alert('Table created successfully!');
      setShowModal(false);
      fetchData();
      setTableForm({ number: 0, seats: 2, status: 'free' });
    } catch (err) {
      alert('Failed to create table');
    }
  };

  const handleUpdateTable = async () => {
    try {
      await tablesAPI.update(selectedItem.id, tableForm);
      alert('Table updated successfully!');
      setShowModal(false);
      fetchData();
      setTableForm({ number: 0, seats: 2, status: 'free' });
    } catch (err) {
      alert('Failed to update table');
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await tablesAPI.delete(id);
      alert('Table deleted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to delete table');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedItem(null);
    if (activeTab === 'users') {
      setUserForm({ name: '', username: '', password: '', role: 'waiter', active: true });
    } else if (activeTab === 'menu') {
      setMenuForm({ name: '', price: 0, category: 'Meals', available: true });
    } else if (activeTab === 'tables') {
      setTableForm({ number: 0, seats: 2, status: 'free' });
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">AP</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Admin Panel</h1>
                <p className="text-xs text-purple-600 font-semibold">Full System Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Dashboard
              </button>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Admin</p>
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
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === 'tables'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tables
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Create Button (not for orders) */}
        {activeTab !== 'orders' && (
          <button
            onClick={openCreateModal}
            className="mb-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
          >
            + Create New
          </button>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-gray-700">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-bold">ID</th>
                      <th className="text-left p-4 font-bold">Name</th>
                      <th className="text-left p-4 font-bold">Username</th>
                      <th className="text-left p-4 font-bold">Role</th>
                      <th className="text-left p-4 font-bold">Status</th>
                      <th className="text-left p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">{u.id}</td>
                        <td className="p-4 font-semibold">{u.name}</td>
                        <td className="p-4 text-gray-600">{u.username}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Menu Items Table */}
            {activeTab === 'menu' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-bold">ID</th>
                      <th className="text-left p-4 font-bold">Name</th>
                      <th className="text-left p-4 font-bold">Price</th>
                      <th className="text-left p-4 font-bold">Category</th>
                      <th className="text-left p-4 font-bold">Available</th>
                      <th className="text-left p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">{item.id}</td>
                        <td className="p-4 font-semibold">{item.name}</td>
                        <td className="p-4 text-orange-600 font-bold">KES {item.price}</td>
                        <td className="p-4 text-gray-600">{item.category}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.available ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tables Table */}
            {activeTab === 'tables' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-bold">ID</th>
                      <th className="text-left p-4 font-bold">Table Number</th>
                      <th className="text-left p-4 font-bold">Seats</th>
                      <th className="text-left p-4 font-bold">Status</th>
                      <th className="text-left p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table) => (
                      <tr key={table.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">{table.id}</td>
                        <td className="p-4 font-semibold">Table {table.number}</td>
                        <td className="p-4 text-gray-600">{table.seats} seats</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            table.status === 'free' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {table.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(table)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTable(table.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Orders Table */}
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-bold">ID</th>
                      <th className="text-left p-4 font-bold">Table</th>
                      <th className="text-left p-4 font-bold">Waiter</th>
                      <th className="text-left p-4 font-bold">Total</th>
                      <th className="text-left p-4 font-bold">Status</th>
                      <th className="text-left p-4 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">{order.id}</td>
                        <td className="p-4 font-semibold">Table {order.tableNumber}</td>
                        <td className="p-4 text-gray-600">{order.waiterName}</td>
                        <td className="p-4 text-orange-600 font-bold">KES {order.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            order.status === 'open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{new Date(order.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              {modalMode === 'create' ? 'Create' : 'Edit'} {activeTab === 'users' ? 'User' : activeTab === 'menu' ? 'Menu Item' : 'Table'}
            </h2>

            {/* User Form */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
                {modalMode === 'create' && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                )}
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="waiter">Waiter</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={userForm.active}
                    onChange={(e) => setUserForm({ ...userForm, active: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">Active</span>
                </label>
              </div>
            )}

            {/* Menu Item Form */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={menuForm.category}
                  onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="Drinks">Drinks</option>
                  <option value="Meals">Meals</option>
                  <option value="Desserts">Desserts</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={menuForm.available}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">Available</span>
                </label>
              </div>
            )}

            {/* Table Form */}
            {activeTab === 'tables' && (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Table Number"
                  value={tableForm.number}
                  onChange={(e) => setTableForm({ ...tableForm, number: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Number of Seats"
                  value={tableForm.seats}
                  onChange={(e) => setTableForm({ ...tableForm, seats: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <select
                  value={tableForm.status}
                  onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                >
                  <option value="free">Free</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'users') {
                    modalMode === 'create' ? handleCreateUser() : handleUpdateUser();
                  } else if (activeTab === 'menu') {
                    modalMode === 'create' ? handleCreateMenuItem() : handleUpdateMenuItem();
                  } else if (activeTab === 'tables') {
                    modalMode === 'create' ? handleCreateTable() : handleUpdateTable();
                  }
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition"
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