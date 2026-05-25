import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { adminService } from '../../services';
import { useAdminRoute } from '../../hooks/useProtectedRoute';

const ViewPayments = () => {
  useAdminRoute();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPayments();
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === 'COMPLETED').length,
    pending: payments.filter((p) => p.status === 'PENDING').length,
    totalRevenue: payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">View Payments</h1>
        <p className="text-sm text-ink-600">Overview of all payment logs and gateway transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Total payments</p>
          <p className="text-xl font-bold text-ink-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Completed</p>
          <p className="text-xl font-bold text-ink-900">{stats.completed}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Pending</p>
          <p className="text-xl font-bold text-ink-900">{stats.pending}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Total revenue</p>
          <p className="text-xl font-bold text-ink-900">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-xl p-12 text-center">
          <p className="text-sm text-ink-600">No payments found</p>
        </div>
      ) : (
        <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Payment ID</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Booking ID</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Gateway</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-ink-700">#{payment.id}</td>
                    <td className="px-5 py-3 text-sm text-ink-700">#{payment.bookingId}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-ink-900">
                      ₹{payment.amount}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${
                          payment.status === 'COMPLETED'
                            ? 'badge-success'
                            : payment.status === 'PENDING'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-600">Razorpay</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPayments;
