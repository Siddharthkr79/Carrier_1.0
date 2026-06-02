import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { bookingService, paymentService } from '../../services';
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

  useEffect(() => {
    if (formData.sessionDate) {
      fetchAvailableSlots();
    }
  }, [formData.sessionDate]);

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
            <label className="block text-sm font-medium text-ink-800 mb-1.5">
              Session date
            </label>
            <input
              type="date"
              name="sessionDate"
              value={formData.sessionDate}
              onChange={handleChange}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {formData.sessionDate && slots.length === 0 && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">
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
