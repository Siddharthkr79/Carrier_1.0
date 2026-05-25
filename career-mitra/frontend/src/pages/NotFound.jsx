import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-surface-200 mb-4">404</p>
        <h1 className="text-lg font-semibold text-ink-900 mb-2">Page not found</h1>
        <p className="text-sm text-ink-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-block">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
