import api, { BACKEND_URL } from './api';

export { BACKEND_URL };

// Auth APIs
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  verify: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Mentor APIs
export const mentorService = {
  getAll: (params) => api.get('/mentors', { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  create: (data) => api.post('/mentors', data),
  update: (id, data) => api.put(`/mentors/${id}`, data),
  getProfile: () => api.get('/mentors/profile'),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/mentors/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/mentors/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Booking APIs
export const bookingService = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  approve: (id) => api.put(`/bookings/${id}/approve`),
  reject: (id, reason) => api.put(`/bookings/${id}/reject`, { reason }),
  complete: (id) => api.put(`/bookings/${id}/complete`),
  getAvailableSlots: (mentorId, date) => api.get(`/bookings/available-slots/${mentorId}`, { params: { date } }),
};

// Payment APIs
export const paymentService = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  verify: (data) => api.post('/payments/verify', data),
  getHistory: (params) => api.get('/payments/history', { params }),
};

// Review APIs
export const reviewService = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  getByMentor: (mentorId) => api.get(`/reviews/mentor/${mentorId}`),
};

// Admin APIs
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getMentors: (params) => api.get('/admin/mentors', { params }),
  approveMentor: (id) => api.put(`/admin/mentors/${id}/approve`),
  rejectMentor: (id) => api.put(`/admin/mentors/${id}/reject`),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getPayments: (params) => api.get('/admin/payments', { params }),
};

// Availability APIs
export const availabilityService = {
  getAll: (mentorId) => api.get(`/availability/${mentorId}`),
  create: (data) => api.post('/availability', data),
  update: (id, data) => api.put(`/availability/${id}`, data),
  delete: (id) => api.delete(`/availability/${id}`),
};

// Webinar APIs
export const webinarService = {
  getAll: () => api.get('/webinars'),
  create: (data) => api.post('/webinars', data),
  register: (id) => api.post(`/webinars/${id}/register`),
  start: (id) => api.put(`/webinars/${id}/start`),
  complete: (id) => api.put(`/webinars/${id}/complete`),
  cancel: (id) => api.put(`/webinars/${id}/cancel`),
};

export default {
  authService,
  mentorService,
  bookingService,
  paymentService,
  reviewService,
  adminService,
  availabilityService,
  webinarService,
};
