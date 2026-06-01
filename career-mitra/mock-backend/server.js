// Mock Career Mitra Backend Server (Express.js)
// This is a development server for demonstration purposes

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Mock data storage
const users = {
  students: [
    {
      id: 1,
      name: 'John Student',
      email: 'student@example.com',
      role: 'STUDENT',
      college: 'MIT',
      major: 'Computer Science',
      yearOfStudy: 3
    }
  ],
  mentors: [
    {
      id: 1,
      name: 'Jane Mentor',
      email: 'mentor@example.com',
      role: 'MENTOR',
      bio: 'Senior Software Engineer at Google',
      company: 'Google',
      domain: 'Tech',
      yearsOfExperience: 10,
      sessionPrice: 2000,
      skills: ['React', 'Node.js', 'MongoDB'],
      expertise: ['Full Stack', 'System Design'],
      rating: 4.8,
      reviewCount: 25,
      photoUrl: 'https://via.placeholder.com/150',
      status: 'APPROVED'
    },
    {
      id: 2,
      name: 'John Expert',
      email: 'expert@example.com',
      role: 'MENTOR',
      bio: 'Product Manager at Amazon',
      company: 'Amazon',
      domain: 'Product',
      yearsOfExperience: 8,
      sessionPrice: 2500,
      skills: ['Product Strategy', 'Analytics', 'Design'],
      expertise: ['PM Skills', 'Career Growth'],
      rating: 4.9,
      reviewCount: 32,
      photoUrl: 'https://via.placeholder.com/150',
      status: 'APPROVED'
    }
  ]
};

const activeSessions = {};
const bookings = [
  {
    id: 1,
    mentorId: 1,
    studentId: 1,
    studentName: 'John Student',
    sessionDate: '2026-06-02',
    timeSlot: '09:00-10:00',
    topic: 'React Hooks Deep Dive',
    description: 'Help with custom hooks and context API',
    amount: 2000,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    mentorId: 1,
    studentId: 1,
    studentName: 'John Student',
    sessionDate: '2026-06-03',
    timeSlot: '14:00-15:00',
    topic: 'System Design Mock',
    description: 'System design mock interview',
    amount: 3000,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
const reviews = [];
let nextBookingId = 3;
let nextReviewId = 1;
let authToken = '';

// ===== AUTH ENDPOINTS =====

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // In real app, this would be hashed
    role,
    isActive: true,
    createdAt: new Date()
  };
  
  if (role === 'STUDENT') {
    users.students.push({
      ...newUser,
      college: '',
      major: '',
      yearOfStudy: 0
    });
  } else if (role === 'MENTOR') {
    users.mentors.push({
      ...newUser,
      bio: '',
      company: '',
      domain: '',
      yearsOfExperience: 0,
      sessionPrice: 0,
      skills: [],
      expertise: [],
      rating: 0,
      reviewCount: 0,
      photoUrl: '',
      status: 'PENDING'
    });
  }
  
  const token = 'mock_jwt_token_' + Date.now();
  authToken = token;
  activeSessions[token] = newUser;
  
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  // Mock auth - find user by email
  let user = users.students.find(u => u.email === email);
  if (!user) {
    user = users.mentors.find(u => u.email === email);
  }
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = 'mock_jwt_token_' + Date.now();
  authToken = token;
  activeSessions[token] = user;
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }
  
  const user = activeSessions[token] || users.students[0] || users.mentors[0];
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: true
  });
});

app.get('/api/mentors/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const loggedInUser = activeSessions[token] || users.mentors[0];
  
  if (!loggedInUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const mentor = users.mentors.find(m => m.id === loggedInUser.id || m.email === loggedInUser.email);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor profile not found' });
  }
  res.json(mentor);
});

// ===== MENTOR ENDPOINTS =====

app.get('/api/mentors', (req, res) => {
  const { domain, minExperience, maxPrice } = req.query;
  
  let filtered = [...users.mentors];
  
  if (domain) {
    filtered = filtered.filter(m => m.domain === domain);
  }
  if (minExperience) {
    filtered = filtered.filter(m => m.yearsOfExperience >= parseInt(minExperience));
  }
  if (maxPrice) {
    filtered = filtered.filter(m => m.sessionPrice <= parseInt(maxPrice));
  }
  
  res.json(filtered);
});

app.get('/api/mentors/:id', (req, res) => {
  const mentor = users.mentors.find(m => m.id === parseInt(req.params.id));
  
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }
  
  res.json(mentor);
});

app.post('/api/mentors', (req, res) => {
  const newMentor = req.body;
  newMentor.id = Date.now();
  newMentor.rating = 0;
  newMentor.reviewCount = 0;
  newMentor.status = 'PENDING';
  
  users.mentors.push(newMentor);
  res.status(201).json(newMentor);
});

app.put('/api/mentors/:id', (req, res) => {
  const mentor = users.mentors.find(m => m.id === parseInt(req.params.id));
  
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }
  
  Object.assign(mentor, req.body);
  res.json(mentor);
});

app.post('/api/mentors/upload-photo', (req, res) => {
  res.json({ message: 'Photo uploaded successfully' });
});

// ===== BOOKING ENDPOINTS =====

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { mentorId, sessionDate, timeSlot, topic, description, amount } = req.body;
  
  const booking = {
    id: nextBookingId++,
    mentorId,
    studentId: 1, // Mock student ID
    sessionDate,
    timeSlot,
    topic,
    description,
    amount,
    status: 'PENDING',
    createdAt: new Date()
  };
  
  bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/api/bookings/available-slots/:mentorId', (req, res) => {
  // Mock available slots
  const slots = [
    '09:00-10:00',
    '10:00-11:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00'
  ];
  res.json(slots);
});

app.put('/api/bookings/:id/approve', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  booking.status = 'APPROVED';
  const randomHash = Math.random().toString(36).substring(2, 10);
  booking.meetingLink = `https://meet.jit.si/CareerMitra-Session-${req.params.id}-${randomHash}`;
  res.json(booking);
});

app.put('/api/bookings/:id/complete', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  booking.status = 'COMPLETED';
  res.json(booking);
});

// ===== REVIEW ENDPOINTS =====

app.post('/api/reviews', (req, res) => {
  const { bookingId, rating, comment } = req.body;
  
  const review = {
    id: nextReviewId++,
    bookingId,
    rating,
    comment,
    studentName: 'John Student',
    mentorId: 1,
    createdAt: new Date()
  };
  
  reviews.push(review);
  res.status(201).json(review);
});

app.get('/api/reviews/mentor/:mentorId', (req, res) => {
  const mentorReviews = reviews.filter(r => r.mentorId === parseInt(req.params.mentorId));
  res.json(mentorReviews);
});

// ===== ADMIN ENDPOINTS =====

app.get('/api/admin/dashboard', (req, res) => {
  const totalRevenue = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.amount || 0), 0);
  res.json({
    totalUsers: users.students.length + users.mentors.length,
    totalMentors: users.mentors.length,
    totalSessions: bookings.length,
    totalRevenue: totalRevenue,
    platformEarnings: totalRevenue * 0.15
  });
});

// ===== PAYMENT ENDPOINTS =====

app.post('/api/payments', (req, res) => {
  res.status(201).json({
    id: Date.now(),
    bookingId: req.body.bookingId,
    amount: req.body.amount,
    razorpayOrderId: 'order_' + Date.now(),
    status: 'PENDING'
  });
});

app.post('/api/payments/verify', (req, res) => {
  res.json({ message: 'Payment verified successfully' });
});

app.get('/api/payments/history', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const loggedInUser = activeSessions[token] || users.mentors[0];
  const role = loggedInUser?.role || 'MENTOR';

  const paymentsList = bookings.map(b => {
    const amount = role === 'MENTOR' ? (b.amount || 0) * 0.85 : (b.amount || 0);
    return {
      id: b.id,
      bookingId: b.id,
      amount: amount,
      status: b.status === 'COMPLETED' || b.status === 'APPROVED' ? 'COMPLETED' : 'PENDING',
      createdAt: b.createdAt || new Date().toISOString()
    };
  });
  
  res.json(paymentsList);
});

// ===== AVAILABILITY ENDPOINTS =====

app.get('/api/availability/:mentorId', (req, res) => {
  res.json([
    {
      id: 1,
      mentorId: parseInt(req.params.mentorId),
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      id: 2,
      mentorId: parseInt(req.params.mentorId),
      dayOfWeek: 'WEDNESDAY',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      id: 3,
      mentorId: parseInt(req.params.mentorId),
      dayOfWeek: 'FRIDAY',
      startTime: '09:00',
      endTime: '18:00'
    }
  ]);
});

app.post('/api/availability', (req, res) => {
  const { startTime, endTime } = req.body;
  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'Start time and end time are required' });
  }
  if (startTime >= endTime) {
    return res.status(400).json({ message: 'Start time must be before end time' });
  }
  res.status(201).json(req.body);
});

// ===== ERROR HANDLING =====

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// ===== START SERVER =====

app.listen(PORT, () => {
  console.log(`🚀 Career Mitra Mock Backend running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   POST /api/auth/signup`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET /api/mentors`);
  console.log(`   GET /api/bookings`);
  console.log(`   POST /api/bookings`);
  console.log(`   GET /api/admin/dashboard`);
});
