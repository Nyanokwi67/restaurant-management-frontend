import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

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
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-semibold transition"
              >
                Services
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-4 py-2 text-orange-600 font-bold border-b-2 border-orange-600"
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">
              Get in touch with our team for support, inquiries, or demo requests
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition shadow-lg"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Office Location</h3>
                <p className="text-gray-600 leading-relaxed">
                  123 Restaurant Street<br />
                  Nairobi, Kenya<br />
                  00100
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    <span className="font-bold text-gray-900">Email:</span><br />
                    info@miriamsrestaurant.com
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">Phone:</span><br />
                    +254 700 000 000
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">Support:</span><br />
                    support@miriamsrestaurant.com
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-bold text-gray-900">Monday - Friday:</span> 8:00 AM - 6:00 PM</p>
                  <p><span className="font-bold text-gray-900">Saturday:</span> 9:00 AM - 4:00 PM</p>
                  <p><span className="font-bold text-gray-900">Sunday:</span> Closed</p>
                </div>
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

export default Contact;