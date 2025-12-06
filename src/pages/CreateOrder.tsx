import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetMenuItemsQuery, useGetTableQuery, useCreateOrderMutation } from '../app/services/api';

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

const CreateOrder: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('Drinks');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: table, isLoading: tableLoading, error: tableError } = useGetTableQuery(parseInt(tableId || '0'));
  const { data: menuItems = [], isLoading: menuLoading } = useGetMenuItemsQuery();
  const [createOrder, { isLoading: submitting }] = useCreateOrderMutation();

  const categories = ['Drinks', 'Meals', 'Desserts'];

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

    try {
      await createOrder({
        tableId: table.id,
        waiterId: user.id,
        items: JSON.stringify(orderItems),
        total: calculateTotal(),
        status: 'open',
      }).unwrap();

      alert('Order created successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to create order');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (tableLoading || menuLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (tableError || !table) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-4">Table not found</p>
          <button
            onClick={() => navigate('/tables')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Back to Tables
          </button>
        </div>
      </div>
    );
  }

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory && item.available);

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
                <h1 className="text-xl font-black text-gray-900">Create Order</h1>
                <p className="text-xs text-gray-600 font-semibold">Table {table.number}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tables')}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Back
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
              <h3 className="text-lg font-black text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-7">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
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
                      className="bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:shadow-lg transition"
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
                        <p className="text-2xl font-black text-gray-900 mb-3">
                          KES {item.price.toLocaleString()}
                        </p>
                        <button
                          onClick={() => addItem(item)}
                          className="w-full px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
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
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 sticky top-6">
              <h3 className="text-2xl font-black text-gray-900 mb-4">Order Summary</h3>

              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items added yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-gray-900 hover:text-gray-700 font-bold text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold"
                            >
                              -
                            </button>
                            <span className="font-bold text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                const menuItem = menuItems.find((mi) => mi.id === item.id);
                                if (menuItem) addItem(menuItem);
                              }}
                              className="w-8 h-8 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-gray-900">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-100 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-gray-700">Total</p>
                      <p className="text-3xl font-black text-gray-900">
                        KES {calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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