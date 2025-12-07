import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroRestaurant from '../assets/images/hero-restaurant.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-100">
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
              <span className="text-2xl font-black text-gray-900">Miriam's Restaurant</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <button
                onClick={() => navigate('/')}
                className="text-gray-900 hover:text-gray-700 font-semibold transition"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                About
              </button>
              <button
                onClick={() => navigate('/services')}
                className="text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                Services
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                Contact
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-lg"
              >
                Login
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section - White Background */}
      <div className="relative bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl font-black text-gray-900 mb-6 leading-tight"
              >
                Modern Restaurant Management
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Streamline your restaurant operations with our comprehensive point-of-sale system. 
                From order taking to payment processing, we've got you covered.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold shadow-xl text-lg"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition font-bold text-lg"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100"
              >
                <img
                  src={heroRestaurant}
                  alt="Restaurant"
                  className="w-full h-[500px] object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Transform Your Restaurant Section - Grey-50 Background */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Transform Your Restaurant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a successful restaurant, all in one powerful platform
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Take orders quickly and efficiently with our intuitive interface. Track order status in real-time and ensure timely service.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Accept multiple payment methods including cash, card, and M-Pesa. Secure and fast transactions every time.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Get insights into your restaurant's performance with detailed analytics and customizable reports.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Features Section - Grey-100 Background */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for restaurants of all sizes, from cafes to fine dining establishments
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { title: 'Table Management', desc: 'Manage table availability, reservations, and optimize seating arrangements.' },
              { title: 'Menu Control', desc: 'Update menu items, prices, and availability in real-time across all devices.' },
              { title: 'Staff Management', desc: 'Role-based access control for admins, managers, and waiters with detailed permissions.' },
              { title: 'Real-time Sync', desc: 'All changes sync instantly across devices ensuring everyone is on the same page.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Miriam's Restaurant</span>
            </div>
            <p className="text-gray-600">
              © 2024 Miriam's Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;