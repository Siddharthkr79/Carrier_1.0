import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiUser, FiSettings, FiLogOut, FiBarChart3 } from 'react-icons/fi';

export const Sidebar = ({ isOpen, setIsOpen, userRole }) => {
  const location = useLocation();

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: FiHome },
    { id: 'mentors', label: 'Find Mentors', path: '/mentors', icon: FiUsers },
    { id: 'bookings', label: 'My Bookings', path: '/student/bookings', icon: FiCalendar },
    { id: 'payments', label: 'Payment History', path: '/student/payments', icon: FiDollarSign },
    { id: 'profile', label: 'Profile', path: '/profile', icon: FiUser },
  ];

  const mentorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/mentor/dashboard', icon: FiHome },
    { id: 'requests', label: 'Session Requests', path: '/mentor/requests', icon: FiCalendar },
    { id: 'earnings', label: 'Earnings', path: '/mentor/earnings', icon: FiDollarSign },
    { id: 'profile', label: 'Profile', path: '/mentor/profile', icon: FiUser },
    { id: 'availability', label: 'Availability', path: '/mentor/availability', icon: FiSettings },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { id: 'users', label: 'Manage Users', path: '/admin/users', icon: FiUsers },
    { id: 'mentors', label: 'Manage Mentors', path: '/admin/mentors', icon: FiUsers },
    { id: 'bookings', label: 'Manage Bookings', path: '/admin/bookings', icon: FiCalendar },
    { id: 'payments', label: 'View Payments', path: '/admin/payments', icon: FiDollarSign },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: FiBarChart3 },
  ];

  const menuItems = 
    userRole === 'STUDENT' ? studentMenuItems :
    userRole === 'MENTOR' ? mentorMenuItems :
    userRole === 'ADMIN' ? adminMenuItems : [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-surface-200 z-40 transition-transform duration-200 md:relative md:top-0 md:h-auto md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <nav className="space-y-0.5 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
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

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-warm-red hover:bg-red-50 transition-colors mt-auto">
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-ink-900/10 md:hidden z-30 transition-opacity"
        />
      )}
    </>
  );
};

export const MobileMenuToggle = ({ isOpen, setIsOpen }) => (
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="md:hidden p-1.5 rounded-lg text-ink-600 hover:bg-surface-100 hover:text-ink-900 transition-colors"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);
