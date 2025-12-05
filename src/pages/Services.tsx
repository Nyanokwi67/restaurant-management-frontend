import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import burgerImage from '../assets/images/meal-burger.jpg';
import pastaImage from '../assets/images/meal-pasta.jpg';
import dessertImage from '../assets/images/dessert-cake.jpg';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'features' | 'benefits' | 'tech'>('all');

  const features = [
    {
      title: 'Order Management',
      description: 'Complete order tracking from creation to payment with real-time status updates.',
      category: 'features',
      image: burgerImage,
    },
    {
      title: 'Table Management',
      description: 'Monitor table availability, assign waiters, and manage seating efficiently.',
      category: 'features',
      image: pastaImage,
    },
    {
      title: 'Menu Control',
      description: 'Update menu items, pricing, and availability in real-time across the system.',
      category: 'features',
      image: dessertImage,
    },
    {
      title: 'Role-Based Access',
      description: 'Secure authentication with different permissions for admin, manager, and waiter roles.',
      category: 'features',
    },
    {
      title: 'Payment Processing',
      description: 'Accept multiple payment methods including cash, M-Pesa, and card payments.',
      category: 'features',
    },
    {
      title: 'Real-Time Updates',
      description: 'Instant synchronization across all devices for up-to-date information.',
      category: 'features',
    },
    {
      title: 'Increased Efficiency',
      description: 'Reduce order processing time by 50% with streamlined workflows.',
      category: 'benefits',
    },
    {
      title: 'Better Customer Service',
      description: 'Faster service and accurate orders lead to happier customers.',
      category: 'benefits',
    },
    {
      title: 'Reduced Errors',
      description: 'Digital orders eliminate handwriting mistakes and miscommunication.',
      category: 'benefits',
    },
    {
      title: 'Data Insights',
      description: 'Track sales trends, popular items, and staff performance.',
      category: 'benefits',
    },
    {
      title: 'React & TypeScript',
      description: 'Modern frontend built with React 18 and TypeScript for type safety.',
      category: 'tech',
    },
    {
      title: 'NestJS Backend',
      description: 'Scalable backend architecture with NestJS framework and TypeORM.',
      category: 'tech',
    },
    {
      title: 'SQL Server Database',
      description: 'Reliable data storage with Microsoft SQL Server.',
      category: 'tech',
    },
    {
      title: 'M-Pesa Integration',
      description: 'Direct integration with Safaricom M-Pesa for mobile payments.',
      category: 'tech',
    },
  ];

  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(f => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center transform rotate-3">
                <span className="text-2xl font-black text-white">MR</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Miriam's Restaurant</h1>
                <p className="text-xs text-orange-600 font-semibold">Restaurant Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-semibold transition"
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
                className="px-4 py-2 text-orange-600 font-bold border-b-2 border-orange-600"
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

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-orange-200 sticky top-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Services
                </button>
                <button
                  onClick={() => setSelectedCategory('features')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    selectedCategory === 'features'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setSelectedCategory('benefits')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    selectedCategory === 'benefits'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Benefits
                </button>
                <button
                  onClick={() => setSelectedCategory('tech')}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition text-left ${
                    selectedCategory === 'tech'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Technology
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-10">
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-black text-gray-900 mb-4">
                {selectedCategory === 'all' && 'All Services'}
                {selectedCategory === 'features' && 'System Features'}
                {selectedCategory === 'benefits' && 'Business Benefits'}
                {selectedCategory === 'tech' && 'Technology Stack'}
              </h2>
              <p className="text-xl text-gray-600">
                {selectedCategory === 'all' && 'Everything you need to run your restaurant efficiently'}
                {selectedCategory === 'features' && 'Powerful features to streamline your operations'}
                {selectedCategory === 'benefits' && 'How our system improves your business'}
                {selectedCategory === 'tech' && 'Built with modern, reliable technology'}
              </p>
              <p className="text-lg text-orange-600 font-semibold mt-2">
                Showing {filteredFeatures.length} {selectedCategory === 'all' ? 'services' : selectedCategory}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200 hover:shadow-2xl transition transform hover:-translate-y-2"
                >
                  {feature.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-12 text-white text-center">
              <h2 className="text-4xl font-black mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Transform your restaurant operations today with our comprehensive management system
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-orange-700 text-white font-bold rounded-xl hover:bg-orange-800 transition shadow-lg"
                >
                  Staff Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Miriam's Restaurant</h3>
              <p className="text-gray-400 text-sm">
                Modern restaurant management system built for efficiency and ease of use.
              </p>
            </div>

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
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@miriamsrestaurant.com</li>
                <li>Phone: +254 700 000 000</li>
                <li>Location: Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">© 2025 Miriam's Restaurant. Restaurant Management System.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;