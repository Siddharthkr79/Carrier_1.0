import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiCalendar } from 'react-icons/fi';
import { getInitials } from '../utils/avatar';

export const MentorCard = ({ mentor }) => {
  return (
    <Link
      to={`/mentors/${mentor.id}`}
      className="group block bg-white border border-surface-200 rounded-xl overflow-hidden hover:border-ink-500 hover:shadow-card transition-all duration-200"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          {mentor.image ? (
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-surface-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
              {getInitials(mentor.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-ink-900 truncate">{mentor.name}</h3>
              {mentor.badge === 'Top Mentor' && (
                <span className="bg-amber-50 text-amber-700 text-2xs font-medium px-1.5 py-0.5 rounded shrink-0">
                  Top
                </span>
              )}
            </div>
            <p className="text-xs text-ink-600 truncate">{mentor.role}</p>
            <p className="text-xs text-brand-600 font-medium">{mentor.company}</p>
          </div>
        </div>

        {/* Rating & Info */}
        <div className="flex items-center gap-3 text-xs text-ink-600 mb-3 pb-3 border-b border-surface-100">
          <span className="flex items-center gap-1">
            <FiStar size={12} className="text-amber-500 fill-amber-500" />
            <span className="font-medium text-ink-900">{mentor.rating}</span>
            <span>({mentor.reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <FiCalendar size={12} />
            {mentor.experience}+ yrs
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="bg-surface-100 text-ink-700 px-2 py-0.5 rounded text-2xs font-medium">
              {skill}
            </span>
          ))}
          {mentor.skills.length > 3 && (
            <span className="text-2xs text-ink-500">+{mentor.skills.length - 3}</span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-ink-900">₹{mentor.sessionFee}</span>
            <span className="text-xs text-ink-500 ml-1">/ session</span>
          </div>
          <span className="text-xs font-medium text-brand-600 group-hover:text-brand-700 transition-colors">
            View profile →
          </span>
        </div>
      </div>
    </Link>
  );
};

export const MentorCardSkeleton = () => (
  <div className="bg-white border border-surface-200 rounded-xl overflow-hidden animate-pulse">
    <div className="p-5">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-full bg-surface-100" />
        <div className="flex-1">
          <div className="h-4 bg-surface-100 rounded w-2/3 mb-2" />
          <div className="h-3 bg-surface-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-surface-100 rounded w-full mb-3" />
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 bg-surface-100 rounded w-16" />
        <div className="h-5 bg-surface-100 rounded w-20" />
      </div>
      <div className="h-4 bg-surface-100 rounded w-1/3" />
    </div>
  </div>
);
