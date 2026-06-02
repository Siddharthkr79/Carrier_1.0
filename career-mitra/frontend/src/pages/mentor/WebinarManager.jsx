import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiDollarSign, FiPlusCircle, FiVideo, FiCheckCircle } from 'react-icons/fi';
import { webinarService, mentorService } from '../../services';
import { useAuth } from '../../hooks/useAuth';
import { useMentorRoute } from '../../hooks/useProtectedRoute';
import { toast } from '../../utils/toast';
import { Input, Button, Card, Badge } from '../../components/common/UIComponents';

const WebinarManager = () => {
  useMentorRoute();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [capacityLimit, setCapacityLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMentorWebinars();
  }, []);

  const fetchMentorWebinars = async () => {
    try {
      setLoading(true);
      const [webinarsRes, profileRes] = await Promise.all([
        webinarService.getAll(),
        mentorService.getProfile()
      ]);
      
      const list = webinarsRes.data || [];
      const profile = profileRes.data || {};
      
      // Filter list to only show webinars hosted by this mentor profile ID
      const filtered = list.filter(w => w.mentorId === profile.id);
      setWebinars(filtered);
    } catch (error) {
      console.error('Failed to load webinars:', error);
      toast.error('Failed to fetch webinar listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !sessionDate || !startTime || !endTime || !capacityLimit) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (startTime >= endTime) {
      toast.error('Start time must be before end time');
      return;
    }
    const ticketPrice = parseFloat(price) || 0;
    if (ticketPrice < 0) {
      toast.error('Ticket price cannot be negative');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title,
        description,
        sessionDate,
        timeSlot: `${startTime}-${endTime}`,
        price: ticketPrice,
        capacityLimit: parseInt(capacityLimit) || 100
      };
      await webinarService.create(payload);
      toast.success('Webinar scheduled successfully!');
      
      // Clear form
      setTitle('');
      setDescription('');
      setSessionDate('');
      setStartTime('');
      setEndTime('');
      setPrice('');
      setCapacityLimit('');
      
      fetchMentorWebinars();
    } catch (error) {
      console.error('Failed to create webinar:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule webinar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartWebinar = async (webinarId) => {
    try {
      await webinarService.start(webinarId);
      toast.success('Webinar session is now active!');
      navigate(`/webinar-room/${webinarId}`);
    } catch (error) {
      console.error('Failed to start webinar:', error);
      toast.error('Failed to start webinar call');
    }
  };

  const handleCancelWebinar = async (webinarId) => {
    if (!window.confirm('Are you sure you want to cancel this webinar? This action cannot be undone.')) {
      return;
    }
    try {
      await webinarService.cancel(webinarId);
      toast.success('Webinar cancelled successfully');
      fetchMentorWebinars();
    } catch (error) {
      console.error('Failed to cancel webinar:', error);
      toast.error('Failed to cancel webinar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-surface-200 p-6 md:p-8 rounded-2xl shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/5 filter blur-3xl -z-10" />
        <div>
          <h1 className="text-2xl font-black text-ink-950 tracking-tight flex items-center gap-2">
            Host webinars & workshops
          </h1>
          <p className="text-xs font-semibold text-ink-500 mt-1 uppercase tracking-wider">Configure sessions and broadcast to students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form Area */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white border border-surface-200 sticky top-24">
            <h2 className="text-sm font-bold text-ink-950 uppercase tracking-widest mb-5 flex items-center gap-2">
              <FiPlusCircle className="text-brand-600" size={16} />
              Schedule Session
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Webinar Title *"
                type="text"
                placeholder="e.g. Master React System Design"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div>
                <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will students learn in this workshop?"
                  rows="3"
                  className="input-field resize-none text-xs"
                />
              </div>
              <Input
                label="Session Date *"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Time *"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
                <Input
                  label="End Time *"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ticket Price (₹)"
                  type="number"
                  placeholder="0 for Free"
                  value={price}
                  min="0"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                  label="Max Seats *"
                  type="number"
                  placeholder="e.g. 100"
                  value={capacityLimit}
                  onChange={(e) => setCapacityLimit(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2.5 text-xs font-bold"
              >
                {submitting ? 'Scheduling...' : 'Schedule Webinar'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Scheduled Webinars List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-ink-950 uppercase tracking-widest flex items-center gap-2">
            <FiVideo className="text-indigo-600" size={16} />
            Scheduled Webinars
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-surface-200 rounded-2xl p-6 h-40 animate-pulse" />
              ))}
            </div>
          ) : webinars.length === 0 ? (
            <div className="bg-white border border-surface-200 rounded-2xl p-16 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <FiVideo size={22} />
              </div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">No webinars scheduled yet</h3>
              <p className="text-xs text-ink-500 max-w-xs leading-relaxed">
                Use the scheduling form on the left to organize your first webinar workshop.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {webinars.map((w) => {
                const isUpcoming = w.status === 'UPCOMING';
                const isActive = w.status === 'ACTIVE';
                const isCompleted = w.status === 'COMPLETED';

                return (
                  <div
                    key={w.id}
                    className="card card-hover p-6 bg-white border border-surface-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-sm font-bold text-ink-950 leading-snug">{w.title}</h3>
                        {isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : isCompleted ? (
                          <Badge variant="neutral">Completed</Badge>
                        ) : w.status === 'CANCELLED' ? (
                          <Badge variant="danger">Cancelled</Badge>
                        ) : (
                          <Badge variant="primary">Upcoming</Badge>
                        )}
                      </div>
                      <p className="text-xs text-ink-600 mb-4 line-clamp-2">
                        {w.description || 'No description provided.'}
                      </p>
                    </div>

                    <div>
                      {/* Meta info boxes */}
                      <div className="grid grid-cols-4 gap-2 mb-4 bg-surface-50 rounded-xl p-3 border border-surface-100">
                        <div className="flex flex-col">
                          <span className="text-3xs text-ink-400 font-bold uppercase">Date</span>
                          <span className="text-2xs font-bold text-ink-800 mt-0.5">{w.sessionDate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-3xs text-ink-400 font-bold uppercase">Time</span>
                          <span className="text-2xs font-bold text-ink-800 mt-0.5">{w.timeSlot}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-3xs text-ink-400 font-bold uppercase">Registered</span>
                          <span className="text-2xs font-bold text-indigo-600 mt-0.5">{w.registeredCount} / {w.capacityLimit}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-3xs text-ink-400 font-bold uppercase">Ticket Price</span>
                          <span className="text-2xs font-bold text-emerald-600 mt-0.5">{w.price > 0 ? `₹${w.price}` : 'FREE'}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-surface-100 flex justify-between items-center">
                        <div>
                          {isUpcoming && (
                            <button
                              type="button"
                              onClick={() => handleCancelWebinar(w.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                            >
                              Cancel Webinar
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {isUpcoming && (
                            <button
                              onClick={() => handleStartWebinar(w.id)}
                              className="btn-primary text-xs font-bold py-2 px-5"
                            >
                              Start Live Room
                            </button>
                          )}
                          {isActive && (
                            <button
                              onClick={() => navigate(`/webinar-room/${w.id}`)}
                              className="btn-primary text-xs font-bold py-2 px-5 flex items-center gap-1.5 bg-emerald-600 border-emerald-500 hover:bg-emerald-700 shadow-emerald-500/10"
                            >
                              <FiVideo size={14} />
                              Join Live Call
                            </button>
                          )}
                          {isCompleted && (
                            <div className="text-2xs font-bold text-ink-500 bg-surface-100 px-3.5 py-1.5 rounded-lg flex items-center gap-1">
                              <FiCheckCircle size={12} /> Workshop Completed
                            </div>
                          )}
                          {w.status === 'CANCELLED' && (
                            <div className="text-2xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-lg flex items-center gap-1">
                              ✕ Webinar Cancelled
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WebinarManager;
