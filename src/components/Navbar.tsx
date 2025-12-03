import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  userName,
  userRole,
  onLogout,
  showBackButton = false,
  backTo = '/dashboard',
  title = 'Miriam\'s Restaurant',
  subtitle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="bg-white shadow-lg border-b-4 border-orange-500 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-black text-white">MR</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">{title}</h1>
              <p className="text-xs text-orange-600 font-semibold">{subtitle || userRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(backTo)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                ← Back
              </button>
            )}
            {!isDashboard && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Dashboard
              </button>
            )}
            <div className="px-4 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Online</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition font-semibold shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;