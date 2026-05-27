import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheck, FiAlertCircle, FiVideo, FiDollarSign } from 'react-icons/fi';
import { Button, Badge } from './common/UIComponents';

export const SessionCard = ({ session, onBook, onCancel }) => {
  const statusConfig = {
    confirmed: { variant: 'success', icon: <FiCheck size={12} />, label: 'Confirmed' },
    pending: { variant: 'warning', icon: <FiAlertCircle size={12} />, label: 'Pending' },
    completed: { variant: 'primary', icon: <FiCheck size={12} />, label: 'Completed' },
    cancelled: { variant: 'danger', icon: <FiAlertCircle size={12} />, label: 'Cancelled' },
  };

  const status = statusConfig[session.status] || statusConfig.pending;

  return (
    <div className="card card-hover p-5 bg-white border border-surface-200">
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-ink-900 truncate leading-snug">{session.title}</h3>
          <p className="text-xs font-medium text-ink-500 mt-0.5">{session.mentorName}</p>
        </div>
        <Badge variant={status.variant}>
          <span className="flex items-center gap-1">
            {status.icon}
            {status.label}
          </span>
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold text-ink-600 mb-4 bg-surface-50 rounded-xl px-3 py-2 border border-surface-100">
        <span className="flex items-center gap-1.5">
          <FiCalendar size={13} className="text-brand-500" />
          {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-surface-300" />
        <span className="flex items-center gap-1.5">
          <FiClock size={13} className="text-brand-500" />
          {session.time} · {session.duration}m
        </span>
      </div>

      {session.notes && (
        <div className="text-xs text-ink-600 bg-surface-50/50 rounded-xl px-3.5 py-2.5 mb-4 border border-surface-150 leading-relaxed">
          <span className="font-semibold text-ink-700 block text-2xs uppercase tracking-wider mb-1">Topic details</span>
          "{session.notes}"
        </div>
      )}

      {(onBook || onCancel || (session.status === 'confirmed' && session.meetingLink)) && (
        <div className="flex gap-3 pt-3 border-t border-surface-100 mt-2">
          {session.status === 'confirmed' && session.meetingLink && (
            <Link
              to={`/video-room/${session.id}`}
              className="btn-primary text-xs flex items-center justify-center gap-2 py-2 px-4 flex-1 text-center font-bold"
            >
              <FiVideo size={14} />
              Join Video Room
            </Link>
          )}
          {onBook && session.status === 'pending' && (
            <Button size="sm" onClick={onBook} className="flex-1">
              Confirm Booking
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel} className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50/55 hover:border-rose-300">
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const ReviewCard = ({ review }) => {
  return (
    <div className="py-4 border-b border-surface-100 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-start gap-4 mb-3">
        <img
          src={review.studentImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
          alt={review.studentName}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-ink-950 truncate">{review.studentName}</h4>
            <span className="text-2xs font-semibold text-ink-400">
              {new Date(review.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < review.rating ? 'text-amber-500' : 'text-surface-200'}`}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-ink-600 leading-relaxed pl-13 italic">
        "{review.comment}"
      </p>
    </div>
  );
};

export const PaymentCard = ({ payment }) => {
  const statusConfig = {
    success: { variant: 'success', label: 'Success' },
    pending: { variant: 'warning', label: 'Pending' },
    failed: { variant: 'danger', label: 'Failed' },
  };
  const status = statusConfig[payment.status] || statusConfig.pending;

  return (
    <div className="card card-hover p-5 bg-white border border-surface-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-bold text-ink-900 leading-snug">{payment.mentorName}</h4>
          <p className="text-2xs font-medium text-ink-400 mt-1 font-mono">TXN: {payment.transactionId}</p>
        </div>
        <Badge variant={status.variant}>
          {status.label}
        </Badge>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-surface-100 mt-2">
        <span className="text-2xs font-semibold text-ink-500">
          {new Date(payment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="flex items-center text-sm font-bold text-ink-900">
          <FiDollarSign className="text-emerald-500" size={13} />
          <span>{payment.amount}</span>
        </div>
      </div>
    </div>
  );
};

export const BookingRequestCard = ({ request, onAccept, onReject }) => {
  return (
    <div className="card card-hover p-5 bg-white border border-surface-200">
      <div className="flex items-start gap-3.5 mb-4">
        <img
          src={request.studentImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
          alt={request.studentName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-100"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-ink-900 truncate">{request.studentName}</h4>
          <p className="text-2xs font-medium text-ink-500">{request.requestedFor}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4 bg-surface-50 rounded-xl p-3 border border-surface-100">
        <div className="flex justify-between items-center text-2xs font-semibold text-ink-600">
          <span className="flex items-center gap-1">
            <FiCalendar className="text-brand-500" size={11} />
            Date
          </span>
          <span className="text-ink-900">{new Date(request.proposedDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center text-2xs font-semibold text-ink-600">
          <span className="flex items-center gap-1">
            <FiClock className="text-brand-500" size={11} />
            Time
          </span>
          <span className="text-ink-900">{request.proposedTime}</span>
        </div>
        <div className="flex justify-between items-center text-2xs font-semibold text-ink-600">
          <span className="flex items-center gap-1">
            <FiDollarSign className="text-brand-500" size={11} />
            Amount
          </span>
          <span className="text-ink-900 font-bold text-emerald-600">₹{request.rate}</span>
        </div>
      </div>

      {request.message && (
        <div className="text-xs text-ink-600 bg-surface-100/50 rounded-xl px-3.5 py-2.5 mb-4 border border-surface-150 leading-relaxed italic">
          "{request.message}"
        </div>
      )}

      <div className="flex gap-3 pt-2 border-t border-surface-100">
        <Button variant="success" size="sm" onClick={onAccept} className="flex-1 py-2">
          Accept
        </Button>
        <Button variant="secondary" size="sm" onClick={onReject} className="flex-1 py-2">
          Decline
        </Button>
      </div>
    </div>
  );
};
