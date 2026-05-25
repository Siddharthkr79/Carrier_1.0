import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { adminService } from '../../services';
import { useAdminRoute } from '../../hooks/useProtectedRoute';

const ManageBookings = () => {
  useAdminRoute();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
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
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Manage Bookings</h1>
        <p className="text-sm text-ink-600">Overview of all booking transactions on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Total bookings</p>
          <p className="text-xl font-bold text-ink-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Pending</p>
          <p className="text-xl font-bold text-ink-900">{stats.pending}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Approved</p>
          <p className="text-xl font-bold text-ink-900">{stats.approved}</p>
        </div>
        <div className="bg-white border border-surface-200 rounded-xl p-4">
          <p className="text-xs text-ink-600 font-medium mb-1">Completed</p>
          <p className="text-xl font-bold text-ink-900">{stats.completed}</p>
        </div>
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-xl p-12 text-center">
          <p className="text-sm text-ink-600">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Mentor</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Topic</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-ink-900">{booking.studentName}</td>
                    <td className="px-5 py-3 text-sm text-ink-700">{booking.mentorName}</td>
                    <td className="px-5 py-3 text-sm text-ink-500">
                      {new Date(booking.sessionDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-600">{booking.topic || 'General Session'}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-ink-900">
                      ₹{booking.amount}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${
                          booking.status === 'PENDING'
                            ? 'badge-warning'
                            : booking.status === 'APPROVED'
                            ? 'badge-success'
                            : booking.status === 'COMPLETED'
                            ? 'badge-primary'
                            : 'badge-danger'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
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

export default ManageBookings;
