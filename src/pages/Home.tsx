import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroRestaurant from '../assets/images/hero-restaurant.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">MR</span>
              </div>
              <span className="text-2xl font-black text-gray-900">Miriam's Restaurant</span>
            </div>
            <div className="flex items-center gap-6">
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
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - White Background */}
      <div className="relative bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
                Modern Restaurant Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your restaurant operations with our comprehensive point-of-sale system. 
                From order taking to payment processing, we've got you covered.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold shadow-xl text-lg"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition font-bold text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100">
                <img
                  src={heroRestaurant}
                  alt="Restaurant"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transform Your Restaurant Section - Grey-50 Background */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Transform Your Restaurant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a successful restaurant, all in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Take orders quickly and efficiently with our intuitive interface. Track order status in real-time and ensure timely service.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Accept multiple payment methods including cash, card, and M-Pesa. Secure and fast transactions every time.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Get insights into your restaurant's performance with detailed analytics and customizable reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Section - Grey-100 Background */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for restaurants of all sizes, from cafes to fine dining establishments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Table Management</h4>
              <p className="text-gray-600 text-sm">
                Manage table availability, reservations, and optimize seating arrangements.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Menu Control</h4>
              <p className="text-gray-600 text-sm">
                Update menu items, prices, and availability in real-time across all devices.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Staff Management</h4>
              <p className="text-gray-600 text-sm">
                Role-based access control for admins, managers, and waiters with detailed permissions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Real-time Sync</h4>
              <p className="text-gray-600 text-sm">
                All changes sync instantly across devices ensuring everyone is on the same page.
              </p>
            </div>
          </div>
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