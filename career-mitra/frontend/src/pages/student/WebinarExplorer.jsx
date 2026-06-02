import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiDollarSign, FiVideo, FiActivity, FiArrowRight, FiInfo } from 'react-icons/fi';
import { webinarService } from '../../services';
import { toast } from '../../utils/toast';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Badge, Button } from '../../components/common/UIComponents';

const WebinarExplorer = () => {
  useProtectedRoute();
  const navigate = useNavigate();
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const response = await webinarService.getAll();
      const activeWebinars = (response.data || []).filter(w => w.status !== 'CANCELLED');
      setWebinars(activeWebinars);
    } catch (error) {
      console.error('Failed to fetch webinars:', error);
      toast.error('Failed to load webinars');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (webinarId, price) => {
    const confirmMsg = price > 0 
      ? `Confirm registration and mock payment of ₹${price} for this webinar?`
      : 'Confirm registration for this free webinar?';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setRegisteringId(webinarId);
      await webinarService.register(webinarId);
      toast.success('Successfully registered for the webinar!');
      fetchWebinars();
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Header Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-surface-200 p-6 md:p-8 rounded-2xl shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/5 filter blur-3xl -z-10" />
        <div>
          <h1 className="text-2xl font-black text-ink-950 tracking-tight flex items-center gap-2">
            Webinars & Workshops
          </h1>
          <p className="text-xs font-semibold text-ink-500 mt-1 uppercase tracking-wider">Learn 1-to-many from top industry leaders</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-surface-200 rounded-2xl p-6 h-52 animate-pulse" />
          ))}
        </div>
      ) : webinars.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl p-16 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
            <FiVideo size={22} />
          </div>
          <h3 className="text-sm font-bold text-ink-900 mb-1">No webinars scheduled</h3>
          <p className="text-xs text-ink-500 max-w-xs leading-relaxed">
            Check back later! Mentors will be hosting live system design sessions and PM reviews soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webinars.map((w) => {
            const seatsLeft = w.capacityLimit - w.registeredCount;
            const isFull = seatsLeft <= 0;
            const isActive = w.status === 'ACTIVE';
            const isCompleted = w.status === 'COMPLETED';

            return (
              <div
                key={w.id}
                className="card card-hover p-6 bg-white border border-surface-200 flex flex-col justify-between"
              >
                <div>
                  {/* Title & Badge */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-sm font-bold text-ink-950 leading-snug">{w.title}</h3>
                    {isActive ? (
                      <Badge variant="success">LIVE NOW</Badge>
                    ) : isCompleted ? (
                      <Badge variant="neutral">Completed</Badge>
                    ) : (
                      <Badge variant="primary">Upcoming</Badge>
                    )}
                  </div>

                  {/* Host Mentor */}
                  <p className="text-2xs font-semibold text-indigo-600 uppercase tracking-wider mb-4">
                    Hosted by: {w.mentorName}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-ink-600 mb-5 leading-relaxed line-clamp-3">
                    {w.description}
                  </p>
                </div>

                <div>
                  {/* Meta items */}
                  <div className="grid grid-cols-2 gap-3 mb-5 bg-surface-50 rounded-xl p-3 border border-surface-100">
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-ink-600">
                      <FiCalendar size={13} className="text-brand-500" />
                      <span>{new Date(w.sessionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-ink-600">
                      <FiClock size={13} className="text-brand-500" />
                      <span>{w.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-ink-600">
                      <FiUsers size={13} className="text-brand-500" />
                      <span>{seatsLeft} / {w.capacityLimit} seats left</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-ink-600">
                      <FiDollarSign size={13} className="text-brand-500" />
                      <span className="text-emerald-600 font-bold">{w.price > 0 ? `₹${w.price}` : 'FREE'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-surface-100 flex gap-2">
                    {(w.isRegistered || w.registered) ? (
                      isActive ? (
                        <button
                          onClick={() => navigate(`/webinar-room/${w.id}`)}
                          className="w-full btn-primary py-2 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <FiVideo size={14} />
                          Join Webinar
                        </button>
                      ) : isCompleted ? (
                        <button disabled className="w-full btn-secondary py-2 text-xs font-bold bg-surface-100 cursor-not-allowed">
                          Webinar Ended
                        </button>
                      ) : (
                        <div className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5">
                          <FiCheck size={12} /> Registered (Waiting to Start)
                        </div>
                      )
                    ) : isCompleted ? (
                      <button disabled className="w-full btn-secondary py-2 text-xs font-bold bg-surface-100 cursor-not-allowed">
                        Webinar Ended
                      </button>
                    ) : isFull ? (
                      <button disabled className="w-full btn-secondary py-2 text-xs font-bold bg-surface-100 cursor-not-allowed text-ink-400">
                        Webinar Full
                      </button>
                    ) : (
                      <Button
                        onClick={() => handleRegister(w.id, w.price)}
                        disabled={registeringId === w.id}
                        className="w-full py-2 text-xs font-bold"
                      >
                        {registeringId === w.id ? 'Registering...' : 'Register for Webinar'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simple check icon helper
const FiCheck = ({ size }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default WebinarExplorer;
