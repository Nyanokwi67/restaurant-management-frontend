import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

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
                className="px-4 py-2 text-orange-600 font-bold border-b-2 border-orange-600"
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

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">About Us</h2>
            <p className="text-xl text-gray-600">
              Revolutionizing restaurant management with modern technology
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-orange-200 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Miriam's Restaurant Management System was born from the real-world challenges faced by restaurant owners and staff. We witnessed firsthand how manual processes, paper orders, and disconnected systems led to errors, delays, and frustrated customers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our mission is simple: make restaurant operations seamless, efficient, and error-free. We combine cutting-edge technology with an intuitive design to create a system that anyone can use, from seasoned managers to new waitstaff.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we're proud to offer a comprehensive solution that handles everything from order taking to payment processing, helping restaurants focus on what they do best: serving great food and creating memorable experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200 text-center">
              <h3 className="text-4xl font-black text-purple-600 mb-3">100%</h3>
              <p className="text-gray-900 font-bold mb-2">Reliable</p>
              <p className="text-gray-600 text-sm">System uptime and stability</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 text-center">
              <h3 className="text-4xl font-black text-blue-600 mb-3">50%</h3>
              <p className="text-gray-900 font-bold mb-2">Faster</p>
              <p className="text-gray-600 text-sm">Order processing time</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 text-center">
              <h3 className="text-4xl font-black text-green-600 mb-3">24/7</h3>
              <p className="text-gray-900 font-bold mb-2">Support</p>
              <p className="text-gray-600 text-sm">Always here to help</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-orange-200 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Simplicity</h4>
                <p className="text-gray-600 leading-relaxed">
                  We believe great software should be intuitive. No complex manuals, no lengthy training sessions—just simple, effective tools.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Reliability</h4>
                <p className="text-gray-600 leading-relaxed">
                  Your restaurant depends on our system. We've built it to be rock-solid, with robust error handling and data protection.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-gray-600 leading-relaxed">
                  We continuously evolve our platform with the latest technologies and features based on real restaurant needs.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Customer Success</h4>
                <p className="text-gray-600 leading-relaxed">
                  Your success is our success. We're committed to helping your restaurant thrive with exceptional support and updates.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Join Us?</h2>
            <p className="text-xl text-orange-100 mb-8">
              Experience the future of restaurant management
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
              >
                View Services
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-3 bg-orange-700 text-white font-bold rounded-xl hover:bg-orange-800 transition shadow-lg"
              >
                Contact Us
              </button>
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

export default About;