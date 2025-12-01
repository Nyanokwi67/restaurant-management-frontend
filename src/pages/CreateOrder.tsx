import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuItemsAPI, ordersAPI, tablesAPI } from '../services/api';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface Table {
  id: number;
  number: number;
  seats: number;
  status: 'free' | 'occupied';
}

const CreateOrder: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [table, setTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [tableId]);

  const fetchData = async () => {
    try {
      // Fetch menu items
      const menuData = await menuItemsAPI.getAll();
      setMenuItems(menuData.filter((item: MenuItem) => item.available));

      // Fetch table info
      const tablesData = await tablesAPI.getAll();
      const currentTable = tablesData.find((t: Table) => t.id === parseInt(tableId || '0'));
      setTable(currentTable || null);
    } catch (err) {
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find((item) => item.id === menuItem.id);

    if (existingItem) {
      // Increase quantity
      setOrderItems(
        orderItems.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Add new item
      setOrderItems([...orderItems, { ...menuItem, quantity: 1 }]);
    }
  };

  const removeItem = (itemId: number) => {
    const item = orderItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.quantity > 1) {
      // Decrease quantity
      setOrderItems(
        orderItems.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      );
    } else {
      // Remove item completely
      setOrderItems(orderItems.filter((i) => i.id !== itemId));
    }
  };

  const deleteItem = (itemId: number) => {
    setOrderItems(orderItems.filter((i) => i.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSaveOrder = async () => {
    if (orderItems.length === 0) {
      alert('Please add items to the order');
      return;
    }

    if (!table) {
      alert('Table not found');
      return;
    }

    try {
      const orderData = {
        tableId: table.id,
        tableNumber: table.number,
        waiterId: user?.id || 0,
        waiterName: user?.name || '',
        items: JSON.stringify(
          orderItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
        total: calculateTotal(),
        status: 'open',
      };

      await ordersAPI.create(orderData);
      alert('Order created successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to create order');
    }
  };

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Create Order</h1>
                <p className="text-xs text-orange-600 font-semibold">
                  Table {table?.number} • {table?.seats} Seats
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tables')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Cancel
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Menu Items 🍔</h2>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none mb-4"
              />

              {/* Category Filters */}
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-orange-300 transition cursor-pointer"
                  onClick={() => addItem(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-xl font-black text-orange-600">KES {item.price}</p>
                  </div>
                  <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition font-semibold">
                    Add to Order
                  </button>
                </div>
              ))}
            </div>

            {filteredMenuItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No menu items found</p>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200 sticky top-6">
              <h3 className="text-2xl font-black text-gray-900 mb-4">Order Summary</h3>

              {orderItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No items added yet</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">KES {item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => addItem(item)}
                            className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="ml-2 w-8 h-8 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t-2 border-gray-200 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-700">Total</p>
                      <p className="text-3xl font-black text-orange-600">
                        KES {calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveOrder}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                  >
                    Save Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;