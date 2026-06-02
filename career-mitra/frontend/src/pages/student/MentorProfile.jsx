import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { Badge } from '../../components/common/UIComponents';
import { ReviewCard } from '../../components/Cards';
import { mockMentors, mockReviews } from '../../data/mockData';
import { mentorService, reviewService, BACKEND_URL } from '../../services';
import { getInitials } from '../../utils/avatar';

const mapMentorData = (m) => {
  let imageUrl = m.photoUrl;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = BACKEND_URL + imageUrl;
  }
  return {
    id: m.id,
    name: m.name,
    role: m.domain || 'Mentor',
    company: m.company || 'Tech Expert',
    image: imageUrl || null,
    skills: m.skills || [],
    experience: m.yearsOfExperience || 0,
    rating: m.rating || 5.0,
    reviews: m.reviewCount || 0,
    sessionFee: m.sessionPrice || 0,
    about: m.bio || '',
    availability: m.expertise || ['Mon', 'Wed', 'Fri'],
    badge: m.rating >= 4.8 ? 'Top Mentor' : 'Verified'
  };
};

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setLoading(true);
        const response = await mentorService.getById(id);
        setMentor(mapMentorData(response.data));

        try {
          const reviewsRes = await reviewService.getByMentor(id);
          setReviews(reviewsRes.data);
        } catch (err) {
          console.error('Failed to fetch reviews', err);
          const mockRev = mockReviews.filter(r => r.mentorId === parseInt(id));
          setReviews(mockRev);
        }
      } catch (error) {
        console.error('Failed to fetch mentor profile from API', error);
        const mock = mockMentors.find(m => m.id === parseInt(id)) || mockMentors[0];
        setMentor(mock);
        const mockRev = mockReviews.filter(r => r.mentorId === mock.id);
        setReviews(mockRev);
      } finally {
        setLoading(false);
      }
    };
    fetchMentorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Back */}
      <button
        onClick={() => navigate('/mentors')}
        className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900 transition-colors mb-6"
      >
        <FiArrowLeft size={16} />
        Back to mentors
      </button>

      {/* Profile Header */}
      <div className="bg-white border border-surface-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {mentor.image ? (
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-20 h-20 rounded-xl object-cover ring-1 ring-surface-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl shrink-0">
              {getInitials(mentor.name)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-ink-900">{mentor.name}</h1>
                  {mentor.badge && (
                    <Badge variant={mentor.badge === 'Top Mentor' ? 'warning' : 'success'}>
                      {mentor.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-ink-600">{mentor.role} at <span className="font-medium text-ink-800">{mentor.company}</span></p>
              </div>
              <button
                onClick={() => navigate(`/bookings/new/${mentor.id}`)}
                className="btn-primary"
              >
                Book session · ₹{mentor.sessionFee}
              </button>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-ink-600">
              <span className="flex items-center gap-1">
                <FiStar size={14} className="text-amber-500" />
                <span className="font-medium text-ink-900">{mentor.rating}</span>
                <span>({reviews.length} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={14} />
                {mentor.experience}+ years
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                60 min sessions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white border border-surface-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ink-900 mb-3">About</h2>
            <p className="text-sm text-ink-600 leading-relaxed">{mentor.about}</p>
          </div>

          {/* Skills */}
          <div className="bg-white border border-surface-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ink-900 mb-3">Skills & expertise</h2>
            <div className="flex flex-wrap gap-2">
              {mentor.skills.map((skill) => (
                <span key={skill} className="bg-surface-100 text-ink-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white border border-surface-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ink-900 mb-4">
              Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-500 py-4 text-center">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Session Details */}
          <div className="bg-white border border-surface-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">Session details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                  <span className="text-brand-600 text-sm font-bold">₹</span>
                </div>
                <div>
                  <p className="text-2xs text-ink-500">Session fee</p>
                  <p className="text-sm font-semibold text-ink-900">₹{mentor.sessionFee}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FiClock size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xs text-ink-500">Duration</p>
                  <p className="text-sm font-semibold text-ink-900">60 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                  <FiMapPin size={14} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-2xs text-ink-500">Available on</p>
                  <p className="text-sm font-semibold text-ink-900">{mentor.availability.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-brand-600 rounded-xl p-5 text-white">
            <h3 className="font-semibold mb-2">Ready to learn?</h3>
            <p className="text-brand-100 text-xs mb-4 leading-relaxed">
              Book a session with {mentor.name} and start your career transformation.
            </p>
            <button
              onClick={() => navigate(`/bookings/new/${mentor.id}`)}
              className="w-full py-2.5 bg-white text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
