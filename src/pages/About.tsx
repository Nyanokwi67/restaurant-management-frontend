import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
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
                className="text-gray-600 hover:text-gray-900 font-semibold transition"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="text-gray-900 hover:text-gray-700 font-semibold transition"
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

      {/* Hero Section - White */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-black text-gray-900 mb-6">About Us</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're revolutionizing restaurant management with cutting-edge technology 
              that makes running your business simpler, faster, and more profitable.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section - Grey-50 */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our mission is to empower restaurants with technology that streamlines operations, 
              enhances customer experiences, and drives growth. We believe that every restaurant, 
              regardless of size, deserves access to world-class management tools.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By combining intuitive design with powerful features, we help restaurant owners 
              focus on what they do best: creating exceptional dining experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section - Grey-100 */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Our Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously innovate to provide cutting-edge solutions that keep your 
                restaurant ahead of the competition.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simplicity</h3>
              <p className="text-gray-600 leading-relaxed">
                Complex problems deserve simple solutions. We make restaurant management 
                effortless and intuitive.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reliability</h3>
              <p className="text-gray-600 leading-relaxed">
                Your business depends on us, so we ensure our platform is always available, 
                secure, and performing at its best.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - White */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-8">Why Choose Us</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              With years of experience in the restaurant industry and technology sector, 
              we understand the unique challenges you face and have built solutions specifically 
              designed to address them.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold text-lg shadow-xl"
            >
              Get In Touch
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

export default About;