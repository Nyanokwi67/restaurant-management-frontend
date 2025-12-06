import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import burgerImage from '../assets/images/meal-burger.jpg';
import pastaImage from '../assets/images/meal-pasta.jpg';
import dessertImage from '../assets/images/dessert-cake.jpg';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const services = [
    {
      id: 1,
      title: 'Point of Sale System',
      description: 'Complete POS solution with order management, payment processing, and real-time tracking.',
      category: 'Features',
      image: burgerImage,
    },
    {
      id: 2,
      title: 'Table Management',
      description: 'Efficiently manage tables, reservations, and seating arrangements with visual floor plans.',
      category: 'Features',
      image: pastaImage,
    },
    {
      id: 3,
      title: 'Menu Management',
      description: 'Easily update menu items, prices, categories, and availability across all devices instantly.',
      category: 'Features',
      image: dessertImage,
    },
    {
      id: 4,
      title: 'Payment Integration',
      description: 'Accept cash, cards, and M-Pesa payments with secure transaction processing.',
      category: 'Features',
      image: burgerImage,
    },
    {
      id: 5,
      title: 'Staff Management',
      description: 'Role-based access control for admins, managers, and waiters with detailed permissions.',
      category: 'Features',
      image: pastaImage,
    },
    {
      id: 6,
      title: 'Increased Efficiency',
      description: 'Reduce order processing time by up to 50% with streamlined workflows.',
      category: 'Benefits',
      image: dessertImage,
    },
    {
      id: 7,
      title: 'Better Customer Service',
      description: 'Faster service times and accurate orders lead to happier customers.',
      category: 'Benefits',
      image: burgerImage,
    },
    {
      id: 8,
      title: 'Real-time Insights',
      description: 'Make data-driven decisions with comprehensive analytics and reporting.',
      category: 'Benefits',
      image: pastaImage,
    },
    {
      id: 9,
      title: 'Cost Savings',
      description: 'Reduce operational costs through automation and optimized processes.',
      category: 'Benefits',
      image: dessertImage,
    },
    {
      id: 10,
      title: 'Cloud-Based Platform',
      description: 'Access your restaurant data from anywhere, anytime with cloud technology.',
      category: 'Technology',
      image: burgerImage,
    },
    {
      id: 11,
      title: 'Mobile Responsive',
      description: 'Fully responsive design works seamlessly on tablets, phones, and desktops.',
      category: 'Technology',
      image: pastaImage,
    },
    {
      id: 12,
      title: 'Secure & Reliable',
      description: 'Bank-level security with 99.9% uptime guarantee for uninterrupted service.',
      category: 'Technology',
      image: dessertImage,
    },
    {
      id: 13,
      title: 'API Integration',
      description: 'Connect with third-party services and expand functionality through our API.',
      category: 'Technology',
      image: burgerImage,
    },
    {
      id: 14,
      title: 'Automatic Backups',
      description: 'Your data is automatically backed up daily to prevent any loss.',
      category: 'Technology',
      image: pastaImage,
    },
  ];

  const categories = ['All', 'Features', 'Benefits', 'Technology'];

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((service) => service.category === selectedCategory);

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
                className="text-gray-600 hover:text-gray-900 font-semibold transition"
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
                className="text-gray-900 hover:text-gray-700 font-semibold transition"
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

      {/* Hero Section - White */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-black text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive solutions designed to streamline every aspect of your restaurant operations
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid - Grey-50 */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Categories */}
            <div className="col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100 sticky top-6">
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

            {/* Services Grid */}
            <div className="col-span-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Grey-100 */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of restaurants already using our platform to streamline operations
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold text-lg shadow-xl"
            >
              Contact Us Today
            </button>
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

export default Services;