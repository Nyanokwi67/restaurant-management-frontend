import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-red-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
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

      {/* About Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Miriam's Restaurant</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A modern, comprehensive point-of-sale system designed to streamline restaurant operations 
            and enhance efficiency. Built with cutting-edge technology for reliability and ease of use.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200 transform hover:scale-105 transition duration-300">
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6"></div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To provide restaurant owners and staff with powerful, intuitive tools that simplify 
              daily operations, improve customer service, and maximize profitability. We believe 
              technology should work for you, not the other way around.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200 transform hover:scale-105 transition duration-300">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6"></div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To become the leading restaurant management solution, empowering businesses of all 
              sizes with innovative features, exceptional support, and continuous improvements 
              based on real-world needs.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-orange-200 mb-16">
          <h3 className="text-4xl font-black text-gray-900 mb-8 text-center">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Easy to Use</h4>
              <p className="text-gray-600">
                Intuitive interface designed for quick learning. Get your staff up and running in minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h4>
              <p className="text-gray-600">
                Bank-level security with role-based access control. Your data is safe with us.
              </p>
            </div>

            <div className="text-center">
              <div className="h-1 w-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h4>
              <p className="text-gray-600">
                Real-time updates and instant responses. No lag, no waiting, just pure efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-12 text-white">
          <h3 className="text-4xl font-black mb-6 text-center">Built With Modern Technology</h3>
          <p className="text-xl text-center mb-8 text-orange-100">
            Powered by industry-leading frameworks and best practices
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-2xl font-bold">React</p>
              <p className="text-sm text-orange-100">Frontend</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-2xl font-bold">NestJS</p>
              <p className="text-sm text-orange-100">Backend</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-2xl font-bold">TypeScript</p>
              <p className="text-sm text-orange-100">Language</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-2xl font-bold">SQL Server</p>
              <p className="text-sm text-orange-100">Database</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Miriam's Restaurant. Restaurant Management System.</p>
          <p className="text-gray-500 text-sm mt-2">Built with NestJS, React, TypeScript & SQL Server</p>
        </div>
      </footer>
    </div>
  );
};

export default About;