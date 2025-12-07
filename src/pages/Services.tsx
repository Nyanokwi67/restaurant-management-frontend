import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import service images - FEATURES
import servicePosSystem from '../assets/images/service-pos-system.jpg';
import serviceTableManagement from '../assets/images/service-table-management.jpg';
import serviceMenuManagement from '../assets/images/service-menu-management.jpg';
import servicePaymentIntegration from '../assets/images/service-payment-integration.jpg';
import serviceStaffManagement from '../assets/images/service-staff-management.jpg';

// Import service images - BENEFITS
import serviceEfficiency from '../assets/images/service-efficiency.jpg';
import serviceCustomerService from '../assets/images/service-customer-service.jpg';
import serviceInsights from '../assets/images/service-insights.jpg';
import serviceCostSavings from '../assets/images/service-cost-savings.jpg';

// Import service images - TECHNOLOGY
import serviceCloudPlatform from '../assets/images/service-cloud-platform.jpg';
import serviceMobileResponsive from '../assets/images/service-mobile-responsive.jpg';
import serviceSecureReliable from '../assets/images/service-secure-reliable.jpg';
import serviceApiIntegration from '../assets/images/service-api-integration.jpg';
import serviceAutomaticBackups from '../assets/images/service-automatic-backups.jpg';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const services = [
    {
      id: 1,
      title: 'Point of Sale System',
      description: 'Complete POS solution with order management, payment processing, and real-time tracking.',
      category: 'Features',
      image: servicePosSystem,
    },
    {
      id: 2,
      title: 'Table Management',
      description: 'Efficiently manage tables, reservations, and seating arrangements with visual floor plans.',
      category: 'Features',
      image: serviceTableManagement,
    },
    {
      id: 3,
      title: 'Menu Management',
      description: 'Easily update menu items, prices, categories, and availability across all devices instantly.',
      category: 'Features',
      image: serviceMenuManagement,
    },
    {
      id: 4,
      title: 'Payment Integration',
      description: 'Accept cash, cards, and M-Pesa payments with secure transaction processing.',
      category: 'Features',
      image: servicePaymentIntegration,
    },
    {
      id: 5,
      title: 'Staff Management',
      description: 'Role-based access control for admins, managers, and waiters with detailed permissions.',
      category: 'Features',
      image: serviceStaffManagement,
    },
    {
      id: 6,
      title: 'Increased Efficiency',
      description: 'Reduce order processing time by up to 50% with streamlined workflows.',
      category: 'Benefits',
      image: serviceEfficiency,
    },
    {
      id: 7,
      title: 'Better Customer Service',
      description: 'Faster service times and accurate orders lead to happier customers.',
      category: 'Benefits',
      image: serviceCustomerService,
    },
    {
      id: 8,
      title: 'Real-time Insights',
      description: 'Make data-driven decisions with comprehensive analytics and reporting.',
      category: 'Benefits',
      image: serviceInsights,
    },
    {
      id: 9,
      title: 'Cost Savings',
      description: 'Reduce operational costs through automation and optimized processes.',
      category: 'Benefits',
      image: serviceCostSavings,
    },
    {
      id: 10,
      title: 'Cloud-Based Platform',
      description: 'Access your restaurant data from anywhere, anytime with cloud technology.',
      category: 'Technology',
      image: serviceCloudPlatform,
    },
    {
      id: 11,
      title: 'Mobile Responsive',
      description: 'Fully responsive design works seamlessly on tablets, phones, and desktops.',
      category: 'Technology',
      image: serviceMobileResponsive,
    },
    {
      id: 12,
      title: 'Secure & Reliable',
      description: 'Bank-level security with 99.9% uptime guarantee for uninterrupted service.',
      category: 'Technology',
      image: serviceSecureReliable,
    },
    {
      id: 13,
      title: 'API Integration',
      description: 'Connect with third-party services and expand functionality through our API.',
      category: 'Technology',
      image: serviceApiIntegration,
    },
    {
      id: 14,
      title: 'Automatic Backups',
      description: 'Your data is automatically backed up daily to prevent any loss.',
      category: 'Technology',
      image: serviceAutomaticBackups,
    },
  ];

  const categories = ['All', 'Features', 'Benefits', 'Technology'];

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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

      {/* Hero Section - White */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-6xl font-black text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive solutions designed to streamline every aspect of your restaurant operations
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid - Grey-50 */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Categories */}
            <div className="col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100 sticky top-6"
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

            {/* Services Grid */}
            <div className="col-span-10">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="wait">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      variants={cardVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition"
                    >
                      <div className="h-48 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{service.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Grey-100 */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of restaurants already using our platform to streamline operations
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold text-lg shadow-xl"
            >
              Contact Us Today
            </motion.button>
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

export default Services;