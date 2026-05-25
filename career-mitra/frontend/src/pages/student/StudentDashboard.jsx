import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUsers, FiTrendingUp, FiArrowRight, FiBookOpen, FiClock, FiStar, FiActivity } from 'react-icons/fi';
import { SessionCard } from '../../components/Cards';
import { mockMentors } from '../../data/mockData';
import { bookingService } from '../../services';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

const StudentDashboard = () => {
  useProtectedRoute();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAll();
      setSessions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map backend booking properties to client expectations of SessionCard
  const mappedSessions = sessions.map(s => ({
    id: s.id,
    title: s.topic || 'Mentorship Session',
    mentorName: s.mentorName,
    status: s.status.toLowerCase() === 'approved' ? 'confirmed' : s.status.toLowerCase(),
    date: s.sessionDate,
    time: s.timeSlot,
    duration: 60,
    notes: s.description,
    meetingLink: s.meetingLink
  }));

  // Compute live user stats
  const totalSessions = sessions.length;
  const upcomingSessions = sessions.filter(s => s.status === 'APPROVED' || s.status === 'PENDING').length;
  const totalSpent = sessions
    .filter(s => s.status !== 'REJECTED')
    .reduce((sum, s) => sum + (s.amount || 0), 0);
  const avgRating = 4.9; // Default rating indicator

  const statItems = [
    { label: 'Upcoming Sessions', value: upcomingSessions, icon: FiCalendar, color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50' },
    { label: 'Total Sessions Joined', value: totalSessions, icon: FiUsers, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50' },
    { label: 'Total Learning Investment', value: `₹${totalSpent.toLocaleString()}`, icon: FiTrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-100/50' },
    { label: 'Mentors Rated', value: avgRating.toFixed(1), icon: FiStar, color: 'text-pink-600 bg-pink-50 border-pink-100/50' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Welcome Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-surface-200 p-6 md:p-8 rounded-2xl shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/5 filter blur-3xl -z-10" />
        <div>
          <h1 className="text-2xl font-black text-ink-950 tracking-tight flex items-center gap-2">
            Welcome back, {user?.name || 'Scholar'} 👋
          </h1>
          <p className="text-xs font-semibold text-ink-500 mt-1 uppercase tracking-wider">Student Dashboard Hub</p>
        </div>
        <button
          onClick={() => navigate('/mentors')}
          className="btn-primary px-5 py-2.5 text-xs font-bold shrink-0 self-start md:self-auto"
        >
          Book New Session
        </button>
      </div>

      {/* Stats Grid */}
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sessions Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="text-indigo-600" size={16} />
              <h2 className="text-sm font-bold text-ink-950 uppercase tracking-widest">Active Mentorships</h2>
            </div>
            <button
              onClick={() => navigate('/student/bookings')}
              className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 transition-colors"
            >
              Manage all <FiArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white border border-surface-200 rounded-2xl p-5 animate-pulse flex flex-col gap-3">
                    <div className="h-4 bg-surface-100 rounded w-1/3" />
                    <div className="h-3 bg-surface-100 rounded w-1/4" />
                    <div className="h-10 bg-surface-100 rounded-xl w-full mt-2" />
                  </div>
                ))}
              </div>
            ) : mappedSessions.filter(s => s.status !== 'completed').length > 0 ? (
              mappedSessions.filter(s => s.status !== 'completed').map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <div className="bg-white border border-surface-200 rounded-2xl p-10 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <FiBookOpen size={20} />
                </div>
                <h3 className="text-sm font-bold text-ink-900 mb-1">No upcoming sessions scheduled</h3>
                <p className="text-xs text-ink-500 max-w-xs mx-auto mb-5 leading-relaxed">
                  Browse industry professionals to coordinate 1:1 roadmap critiques or code reviews.
                </p>
                <button onClick={() => navigate('/mentors')} className="btn-primary text-xs font-bold px-5 py-2">
                  Browse Mentors
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions / Recommendations */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-ink-950 uppercase tracking-widest mb-4">Dashboard Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/mentors')}
                className="w-full text-left px-4 py-3 text-xs font-bold text-ink-700 bg-surface-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all flex items-center justify-between border border-transparent hover:border-indigo-100 group"
              >
                Find Industry Mentors
                <FiArrowRight size={14} className="text-ink-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/student/bookings')}
                className="w-full text-left px-4 py-3 text-xs font-bold text-ink-700 bg-surface-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all flex items-center justify-between border border-transparent hover:border-indigo-100 group"
              >
                Booking History
                <FiArrowRight size={14} className="text-ink-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recommended Mentors list */}
          <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-ink-950 uppercase tracking-widest mb-4">Recommended Mentors</h3>
            <div className="space-y-4">
              {mockMentors.slice(0, 3).map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => navigate(`/mentors/${mentor.id}`)}
                  className="w-full text-left flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-all group"
                >
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-200 group-hover:ring-indigo-300 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink-900 truncate group-hover:text-indigo-600 transition-colors">{mentor.name}</p>
                    <p className="text-3xs font-semibold text-ink-500 truncate mt-0.5 uppercase tracking-wide">{mentor.role} at {mentor.company}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/50 shrink-0">
                    ₹{mentor.sessionFee}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
