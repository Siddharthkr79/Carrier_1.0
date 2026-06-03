import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiDollarSign, FiStar, FiUsers, FiArrowRight, FiCheckCircle, FiXCircle, FiClock, FiActivity, FiBriefcase } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { bookingService, mentorService, paymentService } from '../../services';
import { useMentorRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

const MentorDashboard = () => {
  useMentorRoute();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    pendingSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    rating: 0,
  });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorStatus, setMentorStatus] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all bookings for this mentor (the backend filters by role via token)
      const [bookingsRes, profileRes, paymentsRes] = await Promise.all([
        bookingService.getAll(),
        mentorService.getProfile(),
        paymentService.getHistory(),
      ]);

      const allBookings = bookingsRes.data || [];
      const profile = profileRes.data || {};
      const payments = paymentsRes.data || [];

      // Compute stats from real data
      const pending = allBookings.filter(b => b.status === 'PENDING');
      const completed = allBookings.filter(b => b.status === 'COMPLETED' || b.status === 'APPROVED');
      const completedPayments = payments.filter(p => p.status === 'COMPLETED');
      const totalEarnings = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = completedPayments.reduce((sum, p) => {
        const paymentDate = new Date(p.createdAt);
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
          return sum + (p.amount || 0);
        }
        return sum;
      }, 0);

      setStats({
        totalSessions: allBookings.length,
        pendingSessions: pending.length,
        completedSessions: completed.length,
        totalEarnings,
        monthlyEarnings,
        rating: profile.rating || 0,
      });

      setPendingBookings(pending.slice(0, 5)); // Show up to 5 on dashboard
      setMentorStatus(profile.status || 'PENDING');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await bookingService.approve(bookingId);
      toast.success('Booking approved');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await bookingService.reject(bookingId, 'Declined by mentor');
      toast.success('Booking declined');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to decline booking');
    }
  };

  const statItems = [
    { label: 'Monthly Earnings', value: `₹${stats.monthlyEarnings.toLocaleString()}`, icon: FiDollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50' },
    { label: 'Total Bookings', value: stats.totalSessions, icon: FiCalendar, color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50' },
    { label: 'Pending Requests', value: stats.pendingSessions, icon: FiUsers, color: 'text-amber-600 bg-amber-50 border-amber-100/50' },
    { label: 'Platform Rating', value: stats.rating > 0 ? stats.rating.toFixed(1) : '—', icon: FiStar, color: 'text-pink-600 bg-pink-50 border-pink-100/50' },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
        <div className="bg-white border border-surface-200 p-8 rounded-2xl animate-pulse mb-6 h-28" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-surface-200 p-5 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      
      {/* Pending Approval Alert Banner */}
      {mentorStatus === 'PENDING' && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-xs flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <FiClock size={20} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-amber-900">Verification Pending</h3>
              <span className="badge badge-warning text-[10px] py-0.5 px-2 font-bold uppercase tracking-wider">Under Review</span>
            </div>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed max-w-3xl">
              Your application to become a mentor is currently being reviewed by our administration team. 
              You can still set up your profile details and specify your availability slots, but students won't 
              be able to view your profile or book sessions with you until your credentials have been verified.
            </p>
          </div>
        </div>
      )}

      {/* Rejected Alert Banner */}
      {mentorStatus === 'REJECTED' && (
        <div className="mb-6 bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-5 shadow-xs flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <FiXCircle size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-rose-900">Verification Rejected</h3>
              <span className="badge badge-danger text-[10px] py-0.5 px-2 font-bold uppercase tracking-wider">Rejected</span>
            </div>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed max-w-3xl">
              Your application to become a mentor was declined by the administrator. This is usually due to incomplete profile 
              information, an inactive LinkedIn profile, or missing/invalid supportive document uploads. Please review and update 
              your profile details, re-upload your verification document, or reach out to support.
            </p>
            <div className="mt-3 flex">
              <button
                onClick={() => navigate('/mentor/profile')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Update Profile Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-surface-200 p-6 md:p-8 rounded-2xl shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-500/5 filter blur-3xl -z-10" />
        <div>
          <h1 className="text-2xl font-black text-ink-950 tracking-tight flex items-center gap-2">
            Welcome back, {user?.name || 'Mentor'} 👋
            {mentorStatus === 'APPROVED' && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-lg border border-emerald-100 font-bold tracking-wide">
                <FiCheckCircle size={11} /> Verified
              </span>
            )}
          </h1>
          <p className="text-xs font-semibold text-ink-500 mt-1 uppercase tracking-wider">Expert Management Console</p>
        </div>
        <button
          onClick={() => navigate('/mentor/profile')}
          className="btn-secondary px-5 py-2.5 text-xs font-bold shadow-2xs"
        >
          Edit Availability
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-surface-200 rounded-2xl p-5 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xs text-ink-500 font-bold uppercase tracking-wider">{stat.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="text-2xl font-black text-ink-950 tracking-tight">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Requests Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="text-indigo-600" size={16} />
              <h2 className="text-sm font-bold text-ink-950 uppercase tracking-widest">Active Requests</h2>
            </div>
            <button
              onClick={() => navigate('/mentor/bookings')}
              className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 transition-colors"
            >
              See Requests <FiArrowRight size={13} />
            </button>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="bg-white border border-surface-200 rounded-2xl p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 animate-bounce">
                <FiBriefcase size={20} />
              </div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">All caught up!</h3>
              <p className="text-xs text-ink-500 max-w-xs leading-relaxed">
                You have no pending booking requests right now. Students will reach out shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="card card-hover p-5 bg-white border border-surface-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-ink-950 leading-snug">{booking.topic || 'Session Call'}</h3>
                      <p className="text-2xs font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">Student: {booking.studentName}</p>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600">₹{booking.amount}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-ink-600 mb-4 bg-surface-50 rounded-xl px-3 py-2 border border-surface-100 w-fit">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={13} className="text-brand-500" />
                      {new Date(booking.sessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                    <span className="flex items-center gap-1.5">
                      <FiClock size={13} className="text-brand-500" />
                      {booking.timeSlot}
                    </span>
                  </div>

                  {booking.description && (
                    <div className="text-xs text-ink-600 bg-surface-50/50 rounded-xl px-3.5 py-2.5 mb-4 border border-surface-150 leading-relaxed italic">
                      "{booking.description}"
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 border-t border-surface-100">
                    <button
                      onClick={() => handleApprove(booking.id)}
                      className="flex items-center gap-2 px-4.5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-500/10"
                    >
                      <FiCheckCircle size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="flex items-center gap-2 px-4.5 py-2 text-xs font-bold text-ink-700 bg-surface-100 rounded-xl hover:bg-surface-200 active:scale-95 transition-all"
                    >
                      <FiXCircle size={14} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-ink-950 uppercase tracking-widest mb-4">Earnings Report</h3>
            
            <div className="text-center py-6 bg-surface-50 rounded-2xl border border-surface-100 mb-4">
              <p className="text-2xs font-extrabold text-indigo-600 uppercase tracking-wider mb-1">This Month</p>
              <p className="text-3xl font-black text-ink-950">₹{stats.monthlyEarnings.toLocaleString()}</p>
              <p className="text-3xs font-semibold text-ink-500 uppercase tracking-wide mt-1.5">Completed {stats.completedSessions} sessions</p>
            </div>
            
            <div className="bg-white border border-surface-200 rounded-2xl p-4 flex justify-between items-center shadow-3xs">
              <div>
                <p className="text-3xs font-extrabold text-ink-500 uppercase tracking-wider">Lifetime Earnings</p>
                <p className="text-lg font-black text-ink-950 mt-0.5">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FiDollarSign size={16} />
              </div>
            </div>
            
            <button
              onClick={() => navigate('/mentor/earnings')}
              className="w-full btn-secondary mt-5 py-2.5 text-xs font-bold shadow-3xs"
            >
              View Full History
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorDashboard;
