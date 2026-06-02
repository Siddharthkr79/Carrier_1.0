import React from 'react';
import { FiUser, FiMail, FiBookOpen, FiBriefcase, FiDollarSign, FiStar, FiAward, FiCheckCircle, FiSlash, FiX } from 'react-icons/fi';
import { BACKEND_URL } from '../services';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const role = (user.role || 'STUDENT').toUpperCase();
  const isActive = user.isActive !== false;
  const isMentor = role === 'MENTOR';
  const profile = isMentor ? (user.mentor || user) : (user.student || user);

  // Fallback values for mock data or sparse records
  const bio = profile?.bio || 'No bio provided yet.';
  const college = profile?.college || 'N/A';
  const major = profile?.major || 'N/A';
  const yearOfStudy = profile?.yearOfStudy ? `${profile.yearOfStudy} Year` : 'N/A';

  const company = profile?.company || 'N/A';
  const domain = profile?.domain || 'N/A';
  const yearsOfExperience = profile?.yearsOfExperience !== undefined ? `${profile.yearsOfExperience} years` : 'N/A';
  const sessionPrice = profile?.sessionPrice !== undefined ? `₹${profile.sessionPrice}` : 'N/A';
  const rating = profile?.rating !== undefined ? profile.rating : 0.0;
  const reviewCount = profile?.reviewCount !== undefined ? profile.reviewCount : 0;
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const expertise = Array.isArray(profile?.expertise) ? profile.expertise : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto border border-surface-200 animate-slide-up"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-surface-100 px-6 py-5 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isMentor ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              <FiUser size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900 leading-none">{user.name}</h2>
              <span className="text-2xs text-ink-500 font-semibold uppercase tracking-wider mt-1 block">
                {role} Profile
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 transition-colors w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-100 font-bold"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2.5 items-center bg-surface-50 border border-surface-100 rounded-xl p-3.5">
            <div className="flex-1 min-w-[120px]">
              <p className="text-3xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Account Status</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-warm-green' : 'bg-warm-red'}`} />
                <span className="text-xs font-bold text-ink-800">{isActive ? 'Active / Allowed Login' : 'Blocked / Login Restricted'}</span>
              </div>
            </div>

            {isMentor && (
              <div className="min-w-[120px]">
                <p className="text-3xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Application Status</p>
                <span className={`badge text-2xs font-bold ${
                  profile.status === 'APPROVED' ? 'badge-success' : profile.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {profile.status || 'PENDING'}
                </span>
              </div>
            )}
          </div>

          {/* Basic User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-50 border border-surface-50/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-ink-500 mb-1">
                <FiMail size={14} className="shrink-0" />
                <span className="text-3xs font-bold uppercase tracking-wider">Email Address</span>
              </div>
              <p className="text-sm font-semibold text-ink-900 truncate">{user.email}</p>
            </div>
            
            <div className="bg-surface-50 border border-surface-50/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-ink-500 mb-1">
                {isMentor ? <FiBriefcase size={14} className="shrink-0" /> : <FiBookOpen size={14} className="shrink-0" />}
                <span className="text-3xs font-bold uppercase tracking-wider">
                  {isMentor ? 'Industry Domain' : 'College Affiliation'}
                </span>
              </div>
              <p className="text-sm font-semibold text-ink-900 truncate">{isMentor ? domain : college}</p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <h3 className="text-2xs font-bold text-ink-500 uppercase tracking-widest">About / Biography</h3>
            <div className="bg-surface-50 border border-surface-100 rounded-xl p-4 text-xs font-medium text-ink-700 leading-relaxed whitespace-pre-line">
              {bio}
            </div>
          </div>

          {/* Role-Specific Profile Sections */}
          {!isMentor ? (
            /* Student Details */
            <div className="space-y-4">
              <h3 className="text-2xs font-bold text-ink-500 uppercase tracking-widest">Academic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-2xs">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block mb-1">Field of Study (Major)</span>
                  <span className="text-sm font-bold text-ink-900">{major}</span>
                </div>
                <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-2xs">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block mb-1">Current Year</span>
                  <span className="text-sm font-bold text-ink-900">{yearOfStudy}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Mentor Details */
            <div className="space-y-5">
              <h3 className="text-2xs font-bold text-ink-500 uppercase tracking-widest">Professional details</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-surface-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block mb-0.5">Current Company</span>
                  <span className="text-xs font-bold text-ink-900">{company}</span>
                </div>
                <div className="bg-white border border-surface-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block mb-0.5">Experience</span>
                  <span className="text-xs font-bold text-ink-900">{yearsOfExperience}</span>
                </div>
                <div className="bg-white border border-surface-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block mb-0.5">Session Price</span>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                    <FiDollarSign size={13} />
                    {sessionPrice}
                  </span>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-4 bg-white border border-surface-200 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <FiStar className="fill-amber-400 text-amber-500 shrink-0" size={16} />
                  <span className="text-sm font-black text-ink-950">{rating.toFixed(1)}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-surface-200" />
                <span className="text-xs font-bold text-ink-600">{reviewCount} total sessions reviewed</span>
              </div>

              {/* Verification Details */}
              <div className="space-y-2">
                <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block">Verification Details</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-600 hover:text-brand-700 font-bold bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-center justify-center gap-2 hover:shadow-card transition-all"
                    >
                      🔗 LinkedIn Profile
                    </a>
                  )}
                  {profile.supportiveDocumentUrl ? (
                    <a
                      href={profile.supportiveDocumentUrl.startsWith('http') ? profile.supportiveDocumentUrl : (BACKEND_URL + profile.supportiveDocumentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-center gap-2 hover:shadow-card transition-all"
                    >
                      📄 Verification Document
                    </a>
                  ) : (
                    <span className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center justify-center gap-2">
                      ⚠️ No Document Uploaded
                    </span>
                  )}
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block">Verified Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => (
                      <span key={index} className="text-2xs font-semibold px-2.5 py-1 bg-indigo-50/50 text-indigo-600 rounded-lg border border-indigo-100/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expertise Areas */}
              {expertise.length > 0 && (
                <div className="space-y-2">
                  <span className="text-3xs font-bold text-ink-500 uppercase tracking-wider block">Areas of Expertise</span>
                  <div className="flex flex-wrap gap-1.5">
                    {expertise.map((exp, index) => (
                      <span key={index} className="text-2xs font-semibold px-2.5 py-1 bg-emerald-50/50 text-emerald-600 rounded-lg border border-emerald-100/50">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
