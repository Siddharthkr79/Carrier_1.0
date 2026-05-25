import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      toast.success('Login successful!');

      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'MENTOR') navigate('/mentor/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900 mb-1 text-center">Welcome back</h2>
      <p className="text-sm text-ink-500 text-center mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-800 mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800 mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-xs text-ink-500 mt-5">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
