// src/pages/CreateOrder.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetMenuItemsQuery, useGetTableQuery, useCreateOrderMutation } from '../app/services/api';
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
  const { data: menuItems = [], isLoading: menuLoading } = useGetMenuItemsQuery(undefined);
  const [createOrder, { isLoading: submitting }] = useCreateOrderMutation();

  const categories = ['Drinks', 'Meals', 'Desserts'];

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

    if (!user || !table) {
      alert('Missing user or table information');
      return;
    }

    const orderData = {
      tableId: table.id,
      waiterId: user.id,
      items: JSON.stringify(orderItems),
      total: calculateTotal(),
      status: 'open',
    };

    console.log('Creating order with data:', orderData);

    try {
      const result = await createOrder(orderData).unwrap();
      console.log('Order created successfully:', result);
      alert('Order created successfully!');
      navigate('/orders');
    } catch (err: any) {
      console.error('Order creation error:', err);
      
      // More detailed error message
      if (err.data?.message) {
        alert(`Failed to create order: ${err.data.message}`);
      } else if (err.status) {
        alert(`Failed to create order: Server returned status ${err.status}`);
      } else {
        alert('Failed to create order. Please check console for details.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (tableLoading || menuLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-700"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (tableError || !table) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-gray-900 mb-4">Table not found</p>
          <button
            onClick={() => navigate('/tables')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Back to Tables
          </button>
        </motion.div>
      </div>
    );
  }

  const filteredItems = menuItems.filter((item: MenuItem) => item.category === selectedCategory && item.available);
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
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Create Order</h1>
                <p className="text-xs text-gray-600 font-semibold">Table {table.number}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
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
              <h3 className="text-lg font-black text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h2
                    key={selectedCategory}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-black text-gray-900"
                  >
                    {selectedCategory}
                  </motion.h2>
                  <p className="text-gray-600">{filteredItems.length} items available</p>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 text-lg">No items available in this category</p>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-4"
                >
                  <AnimatePresence mode="wait">
                    {filteredItems.map((item: MenuItem, index: number) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        className="bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:shadow-lg transition"
                      >
                        {menuImages[item.name] && (
                          <div className="h-40 overflow-hidden">
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              src={menuImages[item.name]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-2xl font-black text-gray-900 mb-3">
                            KES {item.price.toLocaleString()}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addItem(item)}
                            className="w-full px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
                          >
                            Add to Order
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 sticky top-6"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-4">Order Summary</h3>

              {orderItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="text-gray-500">No items added yet</p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {orderItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          layout
                          className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteItem(item.id)}
                              className="text-gray-900 hover:text-gray-700 font-bold text-sm"
                            >
                              Remove
                            </motion.button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold"
                              >
                                -
                              </motion.button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.5 }}
                                animate={{ scale: 1 }}
                                className="font-bold text-gray-900 w-8 text-center"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  const menuItem = menuItems.find((mi: MenuItem) => mi.id === item.id);
                                  if (menuItem) addItem(menuItem);
                                }}
                                className="w-8 h-8 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold"
                              >
                                +
                              </motion.button>
                            </div>
                            <motion.p
                              key={item.price * item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="font-bold text-gray-900"
                            >
                              KES {(item.price * item.quantity).toLocaleString()}
                            </motion.p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-gray-700">Total</p>
                      <motion.p
                        key={calculateTotal()}
                        initial={{ scale: 1.3, color: '#000' }}
                        animate={{ scale: 1, color: '#111827' }}
                        className="text-3xl font-black text-gray-900"
                      >
                        KES {calculateTotal().toLocaleString()}
                      </motion.p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating Order...' : 'Create Order'}
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;