import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuItemsAPI, ordersAPI, tablesAPI } from '../services/api';

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

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Table {
  id: number;
  number: number;
  seats: number;
  status: string;
}

const CreateOrder: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [table, setTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Drinks');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = ['Drinks', 'Meals', 'Desserts'];

  // Map menu item names to images
  const menuImages: { [key: string]: string } = {
    // Drinks
    'Soda': drinkSoda,
    'Water': drinkWater,
    'Juice': drinkJuice,
    'Coffee': drinkCoffee,
    'Tea': drinkTea,
    
    // Meals
    'Burger': mealBurger,
    'Pizza': mealPizza,
    'Pasta': mealPasta,
    'Salad': mealSalad,
    'Steak': mealSteak,
    'Chicken': mealChicken,
    'Fish': mealFish,
    
    // Desserts
    'Ice Cream': dessertIcecream,
    'Cake': dessertCake,
    'Cookies': dessertCookies,
    'Cheesecake': dessertCheesecake,
    'Brownies': dessertBrownies,
  };

  useEffect(() => {
    fetchData();
  }, [tableId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tableData, menuData] = await Promise.all([
        tablesAPI.getOne(parseInt(tableId || '0')),
        menuItemsAPI.getAll(),
      ]);
      setTable(tableData);
      setMenuItems(menuData.filter((item: MenuItem) => item.available));
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (item: MenuItem) => {
    const existingItem = orderItems.find((oi) => oi.id === item.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        { id: item.id, name: item.name, price: item.price, quantity: 1 },
      ]);
    }
  };

  const removeItem = (itemId: number) => {
    const existingItem = orderItems.find((oi) => oi.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === itemId ? { ...oi, quantity: oi.quantity - 1 } : oi
        )
      );
    } else {
      setOrderItems(orderItems.filter((oi) => oi.id !== itemId));
    }
  };

  const deleteItem = (itemId: number) => {
    setOrderItems(orderItems.filter((oi) => oi.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async () => {
    if (orderItems.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    if (!user || !table) return;

    setSubmitting(true);
    try {
      await ordersAPI.create({
        tableId: table.id,
        waiterId: user.id,
        items: JSON.stringify(orderItems),
        total: calculateTotal(),
        status: 'open',
      });

      alert('Order created successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error || !table) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-4">{error || 'Table not found'}</p>
          <button
            onClick={() => navigate('/tables')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
          >
            Back to Tables
          </button>
        </div>
      </div>
    );
  }

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Create Order</h1>
                <p className="text-xs text-orange-600 font-semibold">Table {table.number}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tables')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Back
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
            <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-orange-200 sticky top-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-7">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">{selectedCategory}</h2>
                  <p className="text-gray-600">{filteredItems.length} items available</p>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No items available in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl overflow-hidden border-2 border-orange-200 hover:shadow-lg transition"
                    >
                      {menuImages[item.name] && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={menuImages[item.name]}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-2xl font-black text-orange-600 mb-3">
                          KES {item.price.toLocaleString()}
                        </p>
                        <button
                          onClick={() => addItem(item)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200 sticky top-6">
              <h3 className="text-2xl font-black text-gray-900 mb-4">Order Summary</h3>

              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items added yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 font-bold text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold"
                            >
                              -
                            </button>
                            <span className="font-bold text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItem(menuItems.find((mi) => mi.id === item.id)!)}
                              className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-orange-600">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-gray-700">Total</p>
                      <p className="text-3xl font-black text-orange-600">
                        KES {calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating Order...' : 'Create Order'}
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