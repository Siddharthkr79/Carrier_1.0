import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiChevronDown, FiShield, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/mentors', label: 'Find Mentors', role: 'STUDENT' },
    { path: '/student/dashboard', label: 'Dashboard', role: 'STUDENT' },
    { path: '/student/bookings', label: 'My Bookings', role: 'STUDENT' },
    { path: '/student/webinars', label: 'Webinars', role: 'STUDENT' },
    { path: '/mentor/dashboard', label: 'Dashboard', role: 'MENTOR' },
    { path: '/mentor/bookings', label: 'Requests', role: 'MENTOR' },
    { path: '/mentor/earnings', label: 'Earnings', role: 'MENTOR' },
    { path: '/mentor/webinars', label: 'Webinars', role: 'MENTOR' },
    { path: '/mentor/profile', label: 'Profile', role: 'MENTOR' },
  ];

  const userNavLinks = navLinks.filter(link => !user || link.role === user.role);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-surface-200/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-ink-950 text-base hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-sm font-black shadow-sm shadow-brand-500/20">
              CM
            </span>
            <span className="tracking-tight">Career Mitra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {!user ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-brand-600 bg-brand-50/60' 
                      : 'text-ink-600 hover:text-ink-950 hover:bg-surface-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/mentors"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive('/mentors') 
                      ? 'text-brand-600 bg-brand-50/60' 
                      : 'text-ink-600 hover:text-ink-950 hover:bg-surface-50'
                  }`}
                >
                  Find Mentors
                </Link>
                <div className="w-px h-4 bg-surface-200 mx-2" />
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs font-bold text-ink-700 hover:text-ink-950 hover:bg-surface-50 rounded-xl transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary px-4 py-2 text-xs font-bold shadow-sm"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive(link.path)
                        ? 'text-brand-700 bg-brand-50/70'
                        : 'text-ink-600 hover:text-ink-950 hover:bg-surface-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/admin/dashboard')
                        ? 'text-brand-700 bg-brand-50/70 font-bold'
                        : 'text-ink-600 hover:text-ink-950 hover:bg-surface-50'
                    }`}
                  >
                    Admin Control
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="w-px h-4 bg-surface-200 mx-2" />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-surface-200 bg-surface-0 hover:bg-surface-50 hover:border-ink-400 transition-all duration-200"
                  >
                    <div className="w-6 h-6 bg-gradient-to-tr from-brand-500 to-indigo-400 rounded-full flex items-center justify-center text-white shadow-2xs">
                      <span className="text-3xs font-black">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-ink-800 max-w-[90px] truncate">{user.name}</span>
                    <FiChevronDown
                      size={13}
                      className={`text-ink-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-modal border border-surface-200 overflow-hidden animate-slide-up z-50">
                      <div className="px-4 py-3 bg-surface-50/50 border-b border-surface-200">
                        <p className="text-3xs font-extrabold text-indigo-600 uppercase tracking-widest">{user.role}</p>
                        <p className="text-xs font-bold text-ink-900 truncate mt-0.5">{user.name}</p>
                        <p className="text-3xs font-medium text-ink-500 truncate mt-0.5">{user.email || 'No email setup'}</p>
                        {user.role === 'MENTOR' && user.mentor?.status && (
                          <div className="mt-2">
                            <span className={`badge ${
                              user.mentor.status === 'APPROVED' ? 'badge-success' :
                              user.mentor.status === 'REJECTED' ? 'badge-danger' :
                              'badge-warning'
                            } text-[10px] py-0.5 px-2 font-bold`}>
                              {user.mentor.status}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {user.role === 'MENTOR' ? (
                        <Link
                          to="/mentor/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-ink-700 hover:bg-surface-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiUser size={14} className="text-ink-500" />
                          Edit Profile
                        </Link>
                      ) : (
                        <Link
                          to="/student/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-ink-700 hover:bg-surface-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiUser size={14} className="text-ink-500" />
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-surface-200"
                      >
                        <FiLogOut size={14} />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-ink-700 hover:bg-surface-50 rounded-xl transition-all border border-transparent hover:border-surface-200"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileOpen && (
          <div className="md:hidden pb-5 border-t border-surface-100 pt-3 animate-fade-in space-y-1">
            {!user ? (
              <div className="space-y-1.5">
                <Link
                  to="/"
                  className="block px-4 py-2.5 text-xs font-bold text-ink-700 hover:bg-surface-50 rounded-xl"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/mentors"
                  className="block px-4 py-2.5 text-xs font-bold text-ink-700 hover:bg-surface-50 rounded-xl"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Find Mentors
                </Link>
                <div className="pt-3 border-t border-surface-150 mt-3 space-y-2">
                  <button
                    onClick={() => { navigate('/login'); setIsMobileOpen(false); }}
                    className="w-full btn-secondary text-xs font-bold py-2.5"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setIsMobileOpen(false); }}
                    className="w-full btn-primary text-xs font-bold py-2.5"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-4 py-2.5 bg-surface-50 rounded-xl mb-3 border border-surface-150">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-3xs font-extrabold text-indigo-600 uppercase tracking-widest">{user.role}</p>
                      <p className="text-xs font-bold text-ink-900 mt-0.5">{user.name}</p>
                    </div>
                    {user.role === 'MENTOR' && user.mentor?.status && (
                      <span className={`badge ${
                        user.mentor.status === 'APPROVED' ? 'badge-success' :
                        user.mentor.status === 'REJECTED' ? 'badge-danger' :
                        'badge-warning'
                      } text-[10px] py-0.5 px-2 font-bold`}>
                        {user.mentor.status}
                      </span>
                    )}
                  </div>
                </div>
                {userNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-2.5 text-xs font-bold rounded-xl ${
                      isActive(link.path)
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-ink-700 hover:bg-surface-50'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className={`block px-4 py-2.5 text-xs font-bold rounded-xl ${
                      isActive('/admin/dashboard')
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-ink-700 hover:bg-surface-50'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="pt-3 border-t border-surface-150 mt-3">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                  >
                    <FiLogOut size={14} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
