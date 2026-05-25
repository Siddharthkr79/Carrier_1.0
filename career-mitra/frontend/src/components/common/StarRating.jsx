import React from 'react';
import { FiStar } from 'react-icons/fi';

export const StarRating = ({ rating, maxStars = 5 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(maxStars)].map((_, i) => (
      <span key={i} className={`text-xs ${i < Math.round(rating) ? 'text-amber-500' : 'text-surface-200'}`}>
        ★
      </span>
    ))}
  </div>
);

export const RatingBadge = ({ rating, reviews }) => (
  <div className="flex items-center gap-1.5">
    <FiStar size={14} className="text-amber-500 fill-amber-500" />
    <span className="text-sm font-semibold text-ink-900">{rating}</span>
    {reviews !== undefined && (
      <span className="text-xs text-ink-500">({reviews} reviews)</span>
    )}
  </div>
);
