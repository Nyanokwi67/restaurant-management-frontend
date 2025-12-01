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
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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

      {/* Contact Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our restaurant management system? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
            <h3 className="text-3xl font-black text-gray-900 mb-6">Send Us a Message</h3>
            
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="text-2xl font-bold text-green-700 mb-2">Message Sent!</h4>
                <p className="text-green-600">Thank you for contacting us. We'll get back to you soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📧</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Email Us</h4>
                  <p className="text-gray-600 mb-2">Send us an email anytime!</p>
                  <a href="mailto:info@miriamsrestaurant.com" className="text-orange-600 font-semibold hover:text-orange-700">
                    info@miriamsrestaurant.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📞</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Call Us</h4>
                  <p className="text-gray-600 mb-2">Mon-Fri from 8am to 6pm</p>
                  <a href="tel:+254700000000" className="text-orange-600 font-semibold hover:text-orange-700">
                    +254 700 000 000
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📍</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h4>
                  <p className="text-gray-600 mb-2">Come say hello!</p>
                  <p className="text-orange-600 font-semibold">
                    Nairobi, Kenya<br />
                    Westlands, ABC Place
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Business Hours</h4>
              <div className="space-y-2 text-orange-100">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold text-white">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold text-white">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold text-white">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-orange-200">
          <h3 className="text-4xl font-black text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">How do I get started?</h4>
              <p className="text-gray-600">
                Contact us via email or phone, and our team will guide you through the setup process. 
                We offer personalized onboarding for all new clients.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Is training provided?</h4>
              <p className="text-gray-600">
                Yes! We provide comprehensive training for all staff members, ensuring everyone 
                can use the system efficiently from day one.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">What support is available?</h4>
              <p className="text-gray-600">
                We offer 24/7 email support and phone support during business hours. 
                Emergency technical support is available for critical issues.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Can I customize the system?</h4>
              <p className="text-gray-600">
                Absolutely! Our system is highly customizable to match your restaurant's specific 
                needs and workflows.
              </p>
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

export default Contact;