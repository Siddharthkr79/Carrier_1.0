import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiCornerUpLeft, FiCheckSquare, FiInfo, FiUsers } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { webinarService } from '../services';
import { toast } from '../utils/toast';
import { Badge } from '../components/common/UIComponents';

const WebinarRoom = () => {
  const { webinarId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [webinar, setWebinar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Fetch webinar details
  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        const response = await webinarService.getAll();
        const found = response.data?.find(w => w.id === parseInt(webinarId));
        if (!found) {
          toast.error('Webinar session not found');
          navigate('/');
          return;
        }
        setWebinar(found);
      } catch (error) {
        toast.error('Failed to load webinar details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchWebinar();
  }, [webinarId, navigate]);

  // Load Jitsi Meet script
  useEffect(() => {
    if (loading || !webinar) return;

    if (window.JitsiMeetExternalAPI) {
      setJitsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [loading, webinar]);

  // Initialize Jitsi
  useEffect(() => {
    if (!jitsiLoaded || !webinar || !jitsiContainerRef.current || jitsiApiRef.current) return;

    let roomName = `CareerMitra-Webinar-${webinar.id}`;
    if (webinar.meetingLink) {
      try {
        const cleanLink = webinar.meetingLink.replace(/\/$/, "");
        const parts = cleanLink.split('/');
        roomName = parts[parts.length - 1] || roomName;
      } catch (err) {
        console.error("Failed to parse meeting link:", err);
      }
    }

    const isHost = user.role === 'MENTOR';
    const domain = 'meet.jit.si';
    
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: user.name || 'Participant',
        email: user.email || '',
      },
      configOverwrite: {
        // Mentors start with audio/video. Students are muted and video-off by default for webinar mode.
        startWithAudioMuted: !isHost,
        startWithVideoMuted: !isHost,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        // Keep Jitsi UI simple for students
        TOOLBAR_BUTTONS: isHost 
          ? [
              'microphone', 'camera', 'desktop', 'embedmeeting', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'settings', 'raisehand',
              'videoquality', 'tileview', 'mute-everyone', 'security'
            ]
          : [
              'fullscreen', 'chat', 'raisehand', 'settings'
            ]
      }
    };

    try {
      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    } catch (e) {
      console.error('Failed to initialize Jitsi:', e);
    }

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [jitsiLoaded, webinar, user]);

  const handleEndWebinar = async () => {
    if (!window.confirm('Are you sure you want to end and complete this webinar workshop? This will close the room.')) {
      return;
    }

    try {
      await webinarService.complete(webinarId);
      toast.success('Webinar completed successfully');
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      navigate('/mentor/webinars');
    } catch (error) {
      toast.error('Failed to complete webinar');
    }
  };

  const handleLeaveRoom = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    const target = user.role === 'MENTOR' ? '/mentor/webinars' : '/student/webinars';
    navigate(target);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-surface-50">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-ink-600">Resolving webinar room details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-surface-50 overflow-hidden page-enter">
      {/* Jitsi meet frame */}
      <div className="flex-1 h-2/3 lg:h-full relative bg-black">
        {!jitsiLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-8 h-8 border-2 border-surface-600 border-t-white rounded-full animate-spin mb-3" />
            <p className="text-sm text-surface-400">Securing video broadcast stream...</p>
          </div>
        )}
        <div id="jitsi-iframe-container" ref={jitsiContainerRef} className="w-full h-full" />
      </div>

      {/* Sidebar Info */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-surface-200 bg-white flex flex-col h-1/3 lg:h-full p-6 shadow-md z-10">
        <div className="mb-6">
          <Badge variant={user.role === 'MENTOR' ? 'success' : 'primary'}>
            {user.role === 'MENTOR' ? 'Host Streamer' : 'Attendee Viewer'}
          </Badge>
          <h2 className="text-sm font-bold text-ink-950 line-clamp-2 mt-2 leading-snug">
            {webinar?.title || 'Workshop'}
          </h2>
          <p className="text-3xs font-semibold text-ink-500 uppercase tracking-wider mt-1">
            Host: {webinar?.mentorName}
          </p>
        </div>

        {/* Timer */}
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiClock className="text-brand-600" size={15} />
            <span className="text-2xs font-semibold text-ink-600 uppercase tracking-wider">Elapsed Time</span>
          </div>
          <span className="text-sm font-bold font-mono text-ink-900 animate-pulse">
            {formatDuration(callDuration)}
          </span>
        </div>

        {/* Info text */}
        <div className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 mb-auto">
          <FiInfo className="text-indigo-600 shrink-0 mt-0.5" size={14} />
          <div className="text-3xs font-semibold text-indigo-800 leading-normal">
            {user.role === 'MENTOR' 
              ? 'You are streaming as the primary host. Use Jitsi tools to present slides or share your desktop.'
              : 'You have joined as an attendee. You are muted by default. Use the text chat box to communicate.'}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          {user.role === 'MENTOR' && webinar?.status === 'ACTIVE' && (
            <button
              onClick={handleEndWebinar}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 shadow-md shadow-indigo-500/10"
            >
              <FiCheckSquare size={16} />
              End Workshop Session
            </button>
          )}

          <button
            onClick={handleLeaveRoom}
            className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <FiCornerUpLeft size={16} />
            Leave Webinar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebinarRoom;
