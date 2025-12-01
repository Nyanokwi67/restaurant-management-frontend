import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-red-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center transform rotate-3">
                <span className="text-3xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Miriam's Restaurant</h1>
                <p className="text-xs text-orange-600 font-semibold">Restaurant Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-orange-600 font-bold border-b-2 border-orange-600"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-semibold transition"
              >
                About
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-semibold transition"
              >
                Services
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-semibold transition"
              >
                Contact
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-700 transition shadow-lg"
              >
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
            Streamline Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Restaurant Operations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Complete point-of-sale system for managing orders, tables, inventory, and staff. 
            Built for efficiency and ease of use.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition transform hover:scale-105 shadow-2xl"
          >
            Get Started →
          </button>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 text-center transform hover:scale-105 transition">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Fast & Efficient</h3>
            <p className="text-gray-600">Process orders in seconds with our intuitive interface</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 text-center transform hover:scale-105 transition">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Access</h3>
            <p className="text-gray-600">Role-based permissions keep your data protected</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200 text-center transform hover:scale-105 transition">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Reports</h3>
            <p className="text-gray-600">Track sales, expenses, and performance instantly</p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join restaurants already using Miriam's Restaurant Management System to streamline their operations
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/services')}
              className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              View Services
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-3 bg-orange-700 text-white font-bold rounded-xl hover:bg-orange-800 transition shadow-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🍽️</span>
                <h3 className="text-xl font-bold">Miriam's Restaurant</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Modern restaurant management system built for efficiency and ease of use.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/about')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/services')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Staff Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 info@miriamsrestaurant.com</li>
                <li>📞 +254 700 000 000</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">© 2025 Miriam's Restaurant. Restaurant Management System.</p>
            <p className="text-gray-500 text-xs mt-2">Built with NestJS, React, TypeScript & SQL Server</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;