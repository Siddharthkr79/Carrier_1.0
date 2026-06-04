import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { bookingService, paymentService, availabilityService } from '../../services';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

const BookingPage = () => {
  useProtectedRoute();
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessionDate: '',
    timeSlot: '',
    topic: '',
    description: '',
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchMentorAvailability();
  }, [mentorId]);

  useEffect(() => {
    if (formData.sessionDate) {
      fetchAvailableSlots();
    }
  }, [formData.sessionDate]);

  const fetchMentorAvailability = async () => {
    try {
      const response = await availabilityService.getAll(mentorId);
      const days = (response.data || []).map(slot => slot.dayOfWeek.toUpperCase());
      setAvailableDays([...new Set(days)]);
    } catch (error) {
      toast.error('Failed to fetch mentor availability');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await bookingService.getAvailableSlots(
        mentorId,
        formData.sessionDate
      );
      setSlots(response.data);
    } catch (error) {
      toast.error('Failed to fetch available slots');
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (dateStr) => {
    setFormData(prev => ({
      ...prev,
      sessionDate: dateStr,
      timeSlot: ''
    }));
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];
    
    // Offset cells before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    const weekdaysMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeekName = weekdaysMap[date.getDay()];
      
      const isPast = date < today;
      const isConfigured = availableDays.includes(dayOfWeekName);
      const isAvailable = isConfigured && !isPast;
      
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = formData.sessionDate === dateStr;
      const isToday = date.getTime() === today.getTime();

      let cellClass = "h-9 w-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all relative ";

      if (isAvailable) {
        if (isSelected) {
          cellClass += "bg-brand-600 text-white font-bold scale-105 shadow-md shadow-brand-500/20 cursor-pointer";
        } else {
          cellClass += "bg-brand-50/60 text-brand-700 hover:bg-brand-100 hover:text-brand-800 hover:scale-105 cursor-pointer border border-brand-100/50";
        }
      } else {
        cellClass += "text-ink-300 cursor-not-allowed bg-transparent";
      }

      if (isToday && !isSelected) {
        cellClass += " ring-2 ring-indigo-400 ring-offset-1";
      }

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={!isAvailable}
          onClick={() => handleDateSelect(dateStr)}
          className={cellClass}
          title={isAvailable ? "Available" : "Unavailable"}
        >
          {day}
          {isAvailable && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-500" />
          )}
        </button>
      );
    }

    return cells;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingRes = await bookingService.create({
        ...formData,
        mentorId: parseInt(mentorId),
      });

      const paymentRes = await paymentService.create({
        bookingId: bookingRes.data.id,
        amount: bookingRes.data.amount,
      });

      const isTestKey = !process.env.REACT_APP_RAZORPAY_KEY_ID ||
                        process.env.REACT_APP_RAZORPAY_KEY_ID.includes('test_key') ||
                        process.env.REACT_APP_RAZORPAY_KEY_ID.includes('your_razorpay');

      if (isTestKey || !window.Razorpay) {
        toast.info('Simulating payment for test environment...');
        setTimeout(async () => {
          try {
            await paymentService.verify({
              orderId: paymentRes.data.razorpayOrderId,
              paymentId: 'pay_mock_' + Date.now(),
              signature: 'mock_signature_abc123',
            });
            toast.success('Booking confirmed! (Simulated)');
            navigate('/student/bookings');
          } catch (error) {
            toast.error('Simulated payment verification failed');
            setLoading(false);
          }
        }, 1500);
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentRes.data.amount,
        currency: 'INR',
        order_id: paymentRes.data.razorpayOrderId,
        handler: async (response) => {
          try {
            await paymentService.verify({
              orderId: paymentRes.data.razorpayOrderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success('Booking confirmed!');
            navigate('/student/bookings');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900 transition-colors mb-6"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-xl font-semibold text-ink-900 mb-6">Book a session</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-surface-200 rounded-xl p-5">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-800 mb-2.5 flex items-center gap-1.5">
              <FiCalendar size={15} className="text-brand-500" />
              Select Session Date
            </label>
            
            {/* Custom Interactive Calendar */}
            <div className="bg-surface-50 border border-surface-200/60 rounded-2xl p-4.5 mb-2.5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-ink-950">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-xl border border-surface-200 bg-white flex items-center justify-center text-ink-700 hover:bg-surface-50 hover:text-ink-950 active:scale-95 transition-all"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-xl border border-surface-200 bg-white flex items-center justify-center text-ink-700 hover:bg-surface-50 hover:text-ink-950 active:scale-95 transition-all"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-[10px] font-bold text-ink-400 uppercase tracking-widest text-center py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 justify-items-center">
                {renderCalendarDays()}
              </div>
            </div>

            {formData.sessionDate && (
              <div className="text-xs text-brand-700 font-bold bg-brand-50/50 border border-brand-100/50 rounded-xl px-3 py-2 w-fit mb-3">
                Selected Date: {new Date(formData.sessionDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

            {formData.sessionDate && slots.length === 0 && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5 flex items-center gap-1">
                ⚠️ No slots available for this date. Please choose another date.
              </p>
            )}
          </div>

          {slots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-ink-800 mb-1.5">
                Time slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, timeSlot: slot })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.timeSlot === slot
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-50 text-ink-700 border border-surface-200 hover:border-brand-500'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-800 mb-1.5">
              What do you want to discuss?
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Career transition strategies"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-800 mb-1.5">
              Additional details <span className="text-ink-500 font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any specific topics or questions you'd like to cover..."
              rows="3"
              className="input-field resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.timeSlot}
            className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Continue to payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingPage;
