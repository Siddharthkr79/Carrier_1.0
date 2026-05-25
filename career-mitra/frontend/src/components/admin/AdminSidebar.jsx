import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiUsers, FiBook, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FiUsers, label: 'Users', path: '/admin/users' },
    { icon: FiUsers, label: 'Mentors', path: '/admin/mentors' },
    { icon: FiBook, label: 'Bookings', path: '/admin/bookings' },
    { icon: FiDollarSign, label: 'Payments', path: '/admin/payments' },
  ];

  return (
    <div className="w-56 bg-white border-r border-surface-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-surface-100">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            CM
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">Career Mitra</p>
            <p className="text-2xs text-ink-500">Admin</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-0.5">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(item.path)
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-ink-600 hover:bg-surface-50 hover:text-ink-900'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-surface-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-warm-red hover:bg-red-50 transition-colors"
        >
          <FiLogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
