import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiCornerUpLeft, FiCheckSquare, FiInfo } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';
import { toast } from '../utils/toast';

const VideoRoom = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // Timer interval reference
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to HH:MM:SS
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours > 0 ? String(hours).padStart(2, '0') : null,
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':');
  };

  // Fetch booking details on mount
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getById(bookingId);
        setBooking(response.data);
      } catch (error) {
        toast.error('Failed to load booking details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  // Load Jitsi Meet script and initialize call
  useEffect(() => {
    if (loading || !booking || jitsiApiRef.current) return;

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Clean up script and API
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      document.body.removeChild(script);
    };
  }, [loading, booking]);

  // Initialize Jitsi when script is loaded and container is ready
  useEffect(() => {
    if (!jitsiLoaded || !booking || !jitsiContainerRef.current || jitsiApiRef.current) return;

    // Extract room name from meeting link
    let roomName = `CareerMitra-Session-${booking.id}`;
    if (booking.meetingLink) {
      const parts = booking.meetingLink.split('/');
      roomName = parts[parts.length - 1];
    }

    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: user.name || 'User',
        email: user.email || '',
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true, // Prevents redirection to mobile apps on desktop
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'security'
        ],
      }
    };

    try {
      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    } catch (e) {
      console.error('Jitsi external API failed to initialize:', e);
    }
  }, [jitsiLoaded, booking, user]);

  const handleCompleteSession = async () => {
    if (!window.confirm('Are you sure you want to end and complete this session? This will update the status to Completed.')) {
      return;
    }

    try {
      await bookingService.complete(bookingId);
      toast.success('Session completed successfully');
      
      // Clean up stream before redirecting
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      
      navigate('/mentor/dashboard');
    } catch (error) {
      toast.error('Failed to complete session');
    }
  };

  const handleLeaveCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    const targetDashboard = user.role === 'MENTOR' ? '/mentor/dashboard' : '/student/dashboard';
    navigate(targetDashboard);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-surface-50">
        <div className="w-10 h-10 border-4 border-surface-200 border-t-brand-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-ink-600">Verifying session details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-surface-50 overflow-hidden page-enter">
      {/* Jitsi Meet Container */}
      <div className="flex-1 h-2/3 lg:h-full relative bg-black">
        {!jitsiLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-8 h-8 border-2 border-surface-600 border-t-white rounded-full animate-spin mb-3" />
            <p className="text-sm text-surface-400">Loading secure video call frame...</p>
          </div>
        )}
        <div id="jitsi-iframe-container" ref={jitsiContainerRef} className="w-full h-full" />
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-surface-200 bg-white flex flex-col h-1/3 lg:h-full p-6 shadow-md z-10">
        {/* Session Meta */}
        <div className="mb-6">
          <span className="badge badge-primary mb-2">Active Call</span>
          <h2 className="text-base font-semibold text-ink-900 line-clamp-1">
            {booking?.topic || 'Mentorship Session'}
          </h2>
          <p className="text-xs text-ink-600 mt-1">
            {user.role === 'MENTOR' 
              ? `Student: ${booking?.studentName}` 
              : `Mentor: ${booking?.mentorName}`}
          </p>
        </div>

        {/* Timer Box */}
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiClock className="text-brand-600" size={16} />
            <span className="text-xs font-medium text-ink-700">Duration</span>
          </div>
          <span className="text-sm font-bold font-mono text-ink-900 animate-pulse">
            {formatDuration(callDuration)}
          </span>
        </div>

        {/* Info Alerts */}
        <div className="flex items-start gap-2 bg-brand-50 border border-brand-100 rounded-lg p-3.5 mb-auto">
          <FiInfo className="text-brand-600 shrink-0 mt-0.5" size={14} />
          <div className="text-2xs text-brand-800 leading-normal">
            For the best call quality, ensure you have a stable network and grant camera/microphone permissions.
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="flex flex-col gap-2 mt-6">
          {user.role === 'MENTOR' && booking?.status === 'APPROVED' && (
            <button
              onClick={handleCompleteSession}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              <FiCheckSquare size={16} />
              Complete Session
            </button>
          )}

          <button
            onClick={handleLeaveCall}
            className="w-full btn-secondary flex items-center justify-center gap-2 py-3 border-surface-200"
          >
            <FiCornerUpLeft size={16} />
            Exit call room
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
