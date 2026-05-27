import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiCalendar, FiClock, FiVideo, FiCheckSquare, FiInbox } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { bookingService } from '../../services';
import { useMentorRoute } from '../../hooks/useProtectedRoute';

const BookingRequests = () => {
  useMentorRoute();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Fetch all bookings for the mentor (which backend returns automatically based on the user JWT)
      const response = await bookingService.getAll();
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await bookingService.approve(bookingId);
      toast.success('Booking approved');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return; // Cancel clicked

    try {
      await bookingService.reject(bookingId, reason || 'Declined by mentor');
      toast.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const handleComplete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to mark this session as completed?')) {
      return;
    }

    try {
      await bookingService.complete(bookingId);
      toast.success('Session marked as completed!');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to complete session');
    }
  };

  // Filter bookings based on status
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const upcomingBookings = bookings.filter((b) => b.status === 'APPROVED');
  const pastBookings = bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'REJECTED');

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'PENDING':
        return pendingBookings;
      case 'UPCOMING':
        return upcomingBookings;
      case 'COMPLETED':
        return pastBookings;
      default:
        return [];
    }
  };

  const currentList = getFilteredBookings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink-900 mb-1">Mentor sessions</h1>
          <p className="text-sm text-ink-600">Review your booking requests and join active calls</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-surface-200 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-ink-600 hover:text-ink-900'
          }`}
        >
          Pending requests
          {pendingBookings.length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-3xs font-bold px-1.5 py-0.5 rounded-full">
              {pendingBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`pb-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'UPCOMING'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-ink-600 hover:text-ink-900'
          }`}
        >
          Upcoming sessions
          {upcomingBookings.length > 0 && (
            <span className="bg-brand-100 text-brand-800 text-3xs font-bold px-1.5 py-0.5 rounded-full">
              {upcomingBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`pb-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'COMPLETED'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-ink-600 hover:text-ink-900'
          }`}
        >
          Past & history
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-xl p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-surface-50 flex items-center justify-center border border-surface-100 mb-3.5 text-ink-500">
            <FiInbox size={20} />
          </div>
          <p className="text-sm font-medium text-ink-900">No sessions found</p>
          <p className="text-xs text-ink-500 mt-1">There are no bookings matching the current tab.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((booking) => (
            <div key={booking.id} className="bg-white border border-surface-200 rounded-xl p-5 hover:border-surface-300 transition-colors shadow-soft">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{booking.topic || 'Mentorship Session'}</h3>
                  <p className="text-xs text-ink-600">Student: {booking.studentName}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs font-bold text-ink-900">₹{booking.amount}</span>
                  {booking.status === 'COMPLETED' && (
                    <span className="badge badge-success text-3xs py-0.5">Completed</span>
                  )}
                  {booking.status === 'REJECTED' && (
                    <span className="badge badge-danger text-3xs py-0.5">Declined</span>
                  )}
                  {booking.status === 'APPROVED' && (
                    <span className="badge badge-primary text-3xs py-0.5">Approved</span>
                  )}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="flex items-center gap-4 text-xs text-ink-600 mb-3">
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={13} className="text-ink-500" />
                  {new Date(booking.sessionDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock size={13} className="text-ink-500" />
                  {booking.timeSlot}
                </span>
              </div>

              {/* Description */}
              {booking.description && (
                <p className="text-xs text-ink-600 bg-surface-50 rounded-lg px-3.5 py-2.5 mb-4 border border-surface-100 leading-relaxed">
                  {booking.description}
                </p>
              )}

              {/* Actions Footer */}
              {booking.status === 'PENDING' && (
                <div className="flex gap-2 pt-3 border-t border-surface-100">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-warm-green rounded-lg hover:opacity-90 transition-opacity shadow-soft"
                  >
                    <FiCheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-ink-700 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors border border-surface-200"
                  >
                    <FiXCircle size={14} />
                    Decline
                  </button>
                </div>
              )}

              {booking.status === 'APPROVED' && (
                <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-3 border-t border-surface-100 justify-between">
                  <div className="text-3xs text-ink-500 flex items-center gap-1">
                    <span>Meeting link created automatically</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/video-room/${booking.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-soft"
                    >
                      <FiVideo size={14} />
                      Join Video Call
                    </Link>
                    <button
                      onClick={() => handleComplete(booking.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-ink-700 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors border border-surface-200"
                    >
                      <FiCheckSquare size={14} />
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
