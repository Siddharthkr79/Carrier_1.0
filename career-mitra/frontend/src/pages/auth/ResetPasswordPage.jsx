import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { authService } from '../../services';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Reset token is missing from the URL.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.password);
      toast.success('Password reset successfully!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-ink-900 mb-2">Invalid Link</h2>
        <p className="text-sm text-ink-600 mb-4">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Request new link
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-ink-900 mb-2">Password Updated</h2>
        <p className="text-sm text-ink-600 mb-4">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <Link to="/login" className="w-full inline-block btn-primary py-2.5 text-center font-medium">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900 mb-1 text-center">Set new password</h2>
      <p className="text-sm text-ink-500 text-center mb-6">
        Please choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-800 mb-1.5">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            placeholder="Min 6 characters"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
            placeholder="Confirm password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Reset password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
