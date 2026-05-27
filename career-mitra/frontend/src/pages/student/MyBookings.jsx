import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiClock, FiVideo } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { bookingService, reviewService } from '../../services';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Badge, Button } from '../../components/common/UIComponents';

const MyBookings = () => {
  useProtectedRoute();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAll();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e, bookingId) => {
    e.preventDefault();
    try {
      await reviewService.create({ bookingId, rating, comment });
      toast.success('Review submitted!');
      setReviewingId(null);
      setRating(5);
      setComment('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const statusConfig = {
    PENDING: { variant: 'warning', label: 'Pending' },
    APPROVED: { variant: 'success', label: 'Approved' },
    REJECTED: { variant: 'danger', label: 'Rejected' },
    COMPLETED: { variant: 'primary', label: 'Completed' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="mb-8 flex justify-between items-center bg-white border border-surface-200 p-5 rounded-2xl shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-ink-950 tracking-tight">Your Session Bookings</h1>
          <p className="text-2xs font-semibold text-ink-500 mt-0.5 uppercase tracking-wider">Historical Roadmap Sessions</p>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
          {bookings.length} Session{bookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-surface-200 rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl p-12 text-center">
          <p className="text-xs font-bold text-ink-500 mb-5">You haven't scheduled any sessions yet</p>
          <a href="/mentors" className="btn-primary inline-block text-xs font-bold px-6 py-2.5">
            Explore Mentors
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.PENDING;
            return (
              <div
                key={booking.id}
                className="card card-hover p-5 bg-white border border-surface-200"
              >
                {/* Booking Header */}
                <div className="flex items-start justify-between mb-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-ink-950 leading-snug">{booking.topic || booking.sessionTitle || 'Mentorship Call'}</h3>
                    <p className="text-xs font-medium text-ink-500 mt-0.5">Mentor: {booking.mentorName}</p>
                  </div>
                  <Badge variant={status.variant}>
                    {status.label}
                  </Badge>
                </div>

                {/* Meta details */}
                <div className="flex items-center gap-4 text-2xs font-semibold text-ink-600 mb-4 bg-surface-50 rounded-xl px-3 py-2 border border-surface-100 w-fit">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar size={12} className="text-indigo-600" />
                    {new Date(booking.sessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="w-1 h-3 bg-surface-200" />
                  <span className="flex items-center gap-1.5">
                    <FiClock size={12} className="text-indigo-600" />
                    {booking.timeSlot}
                  </span>
                </div>

                {booking.description && (
                  <div className="text-xs text-ink-600 bg-surface-50/50 rounded-xl px-3.5 py-2.5 mb-4 border border-surface-150 leading-relaxed italic">
                    "{booking.description}"
                  </div>
                )}

                {booking.status === 'APPROVED' && (
                  <div className="pt-3.5 border-t border-surface-100 flex justify-end">
                    <Link
                      to={`/video-room/${booking.id}`}
                      className="btn-primary text-xs flex items-center gap-2 px-5 py-2 font-bold shadow-sm shadow-indigo-500/10"
                    >
                      <FiVideo size={14} />
                      Join Video Call
                    </Link>
                  </div>
                )}

                {/* Review Section */}
                {booking.status === 'COMPLETED' && !booking.reviewId && (
                  <div className="pt-3.5 border-t border-surface-100 mt-2">
                    {reviewingId === booking.id ? (
                      <form onSubmit={(e) => handleReviewSubmit(e, booking.id)} className="space-y-3.5">
                        <div>
                          <label className="block text-2xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">Rate your session</label>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-xl transition-colors ${
                                  star <= rating ? 'text-amber-400' : 'text-surface-200 hover:text-amber-200'
                                }`}
                              >
                                <FiStar fill={star <= rating ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-2xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
                            Review comment
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a brief comment about your experience..."
                            rows="2"
                            className="input-field resize-none text-xs"
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <button type="submit" className="btn-primary text-xs font-bold px-4 py-2">
                            Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewingId(null)}
                            className="btn-secondary text-xs font-bold px-4 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setReviewingId(booking.id)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        Write a review & rate mentor →
                      </button>
                    )}
                  </div>
                )}

                {booking.reviewId && (
                  <div className="text-2xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 w-fit mt-1 flex items-center gap-1.5">
                    <span>✓</span> Review submitted successfully
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
