import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { paymentService } from '../../services';
import { useMentorRoute } from '../../hooks/useProtectedRoute';

const MentorEarnings = () => {
  useMentorRoute();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSessions: 0,
    monthlyEarnings: 0,
  });

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getHistory();
      setPayments(response.data);

      const totalEarnings = response.data.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0);
      const totalSessions = response.data.filter((p) => p.status === 'COMPLETED').length;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = response.data.reduce((sum, p) => {
        const paymentDate = new Date(p.createdAt);
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear && p.status === 'COMPLETED') {
          return sum + p.amount;
        }
        return sum;
      }, 0);

      setStats({ totalEarnings, totalSessions, monthlyEarnings });
    } catch (error) {
      toast.error('Failed to fetch earnings');
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Earnings</h1>
        <p className="text-sm text-ink-600">Track your income and payment history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Total earnings</p>
          <p className="text-2xl font-bold text-ink-900">₹{stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Sessions completed</p>
          <p className="text-2xl font-bold text-ink-900">{stats.totalSessions}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">This month</p>
          <p className="text-2xl font-bold text-ink-900">₹{stats.monthlyEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h2 className="text-sm font-semibold text-ink-900">Payment history</h2>
        </div>

        {payments.length === 0 ? (
          <p className="text-sm text-ink-500 text-center py-12">No payment history</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Booking</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-ink-700">#{payment.bookingId}</td>
                    <td className="px-5 py-3 text-sm font-medium text-ink-900">₹{payment.amount}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorEarnings;
