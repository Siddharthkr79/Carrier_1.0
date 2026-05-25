import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-ink-900">
            <span className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              CM
            </span>
            Career Mitra
          </Link>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-soft">
          {children}
        </div>
        <p className="text-center text-xs text-ink-500 mt-6">
          © {new Date().getFullYear()} Career Mitra
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
