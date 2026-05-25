import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { authService } from '../../services';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      toast.success('Password reset link sent to your email');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-ink-900 mb-2">Check your email</h2>
        <p className="text-sm text-ink-600 mb-4">
          We've sent a password reset link to {email}.
        </p>
        <Link to="/login" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900 mb-1 text-center">Reset password</h2>
      <p className="text-sm text-ink-500 text-center mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-800 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-xs text-ink-500 mt-5">
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
