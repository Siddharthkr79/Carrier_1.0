// Career Mitra Mock Backend - Built-in Node.js only
// No external dependencies required

const http = require('http');
const url = require('url');

const PORT = 8080;

// Mock data
const mentors = [
  {
    id: 1,
    name: 'Jane Mentor',
    email: 'jane@example.com',
    bio: 'Senior Software Engineer at Google',
    company: 'Google',
    domain: 'Tech',
    yearsOfExperience: 10,
    sessionPrice: 2000,
    skills: ['React', 'Node.js', 'MongoDB'],
    expertise: ['Full Stack', 'System Design'],
    rating: 4.8,
    reviewCount: 25,
    status: 'APPROVED'
  },
  {
    id: 2,
    name: 'John Product',
    email: 'john@example.com',
    bio: 'Product Manager at Amazon',
    company: 'Amazon',
    domain: 'Product',
    yearsOfExperience: 8,
    sessionPrice: 2500,
    skills: ['Product Strategy', 'Analytics'],
    expertise: ['PM Skills', 'Career Growth'],
    rating: 4.9,
    reviewCount: 32,
    status: 'APPROVED'
  }
];

const activeSessions = {};
const bookings = [];
const availabilitySlots = [
  { id: 1, mentorId: 1, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00' },
  { id: 2, mentorId: 1, dayOfWeek: 'WEDNESDAY', startTime: '14:00', endTime: '15:00' },
  { id: 3, mentorId: 1, dayOfWeek: 'FRIDAY', startTime: '16:00', endTime: '17:00' }
];
let nextAvailabilityId = 4;
const users = {
  students: [
    { id: 1, name: 'John Student', email: 'student@example.com', role: 'STUDENT' }
  ],
  mentors: mentors
};

const webinars = [
  {
    id: 1,
    title: 'Introduction to System Design',
    description: 'Learn the fundamentals of designing highly scalable systems. We will cover caching, load balancers, and database partitioning.',
    mentorId: 1,
    mentorName: 'Rajesh Kumar',
    sessionDate: '2026-06-05',
    timeSlot: '15:00-16:30',
    price: 500,
    capacityLimit: 100,
    registeredCount: 42,
    status: 'UPCOMING',
    meetingLink: ''
  },
  {
    id: 2,
    title: 'Product Management Strategy & Roadmap',
    description: 'A deep dive into prioritizing product features, building product roadmaps, and stakeholder alignment.',
    mentorId: 2,
    mentorName: 'Priya Sharma',
    sessionDate: '2026-06-08',
    timeSlot: '18:00-19:30',
    price: 750,
    capacityLimit: 50,
    registeredCount: 12,
    status: 'UPCOMING',
    meetingLink: ''
  }
];

const webinarRegistrations = [
  { id: 1, webinarId: 1, studentId: 1, studentName: 'John Student', studentEmail: 'student@example.com', registeredAt: new Date().toISOString() }
];

// Helper to parse JSON body
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(body ? JSON.parse(body) : {});
    } catch (e) {
      callback({});
    }
  });
}

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
}

// Send JSON response
function sendJson(res, status, data) {
  res.writeHead(status);
  res.end(JSON.stringify(data));
}

// Create server
const server = http.createServer((req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // AUTH ENDPOINTS
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    parseBody(req, (data) => {
      // Find database user
      let dbUser = mentors.find(m => m.email === data.email);
      if (!dbUser) {
        dbUser = users.students.find(s => s.email === data.email);
      }

      if (dbUser && dbUser.isActive === false) {
        sendJson(res, 401, { message: 'Your account is blocked. Please contact support.' });
        return;
      }

      const token = 'mock_jwt_' + Date.now();
      let loggedInUser;
      if (dbUser) {
        const role = dbUser.role || (mentors.includes(dbUser) ? 'MENTOR' : 'STUDENT');
        loggedInUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: role,
          isActive: dbUser.isActive
        };
        if (role === 'MENTOR') {
          loggedInUser.mentor = dbUser;
        }
      } else {
        const isDefaultAdmin = data.email.includes('admin');
        loggedInUser = {
          id: isDefaultAdmin ? 999 : 1,
          name: isDefaultAdmin ? 'Admin User' : 'John Student',
          email: data.email,
          role: isDefaultAdmin ? 'ADMIN' : 'STUDENT',
          isActive: true
        };
      }
      activeSessions[token] = loggedInUser;
      sendJson(res, 200, {
        token,
        user: loggedInUser
      });
    });
    return;
  }

  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    parseBody(req, (data) => {
      const token = 'mock_jwt_' + Date.now();
      const newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: true
      };

      if (data.role === 'MENTOR') {
        const newMentor = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          bio: '',
          company: '',
          domain: '',
          yearsOfExperience: 0,
          sessionPrice: 0,
          skills: [],
          expertise: [],
          rating: 0,
          reviewCount: 0,
          status: 'PENDING',
          isActive: true
        };
        mentors.push(newMentor);
        newUser.mentor = newMentor;
      } else {
        users.students.push({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: 'STUDENT',
          isActive: true
        });
      }

      activeSessions[token] = newUser;
      sendJson(res, 201, {
        token,
        user: newUser
      });
    });
    return;
  }

  if (pathname === '/api/auth/verify' && req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    const loggedInUser = activeSessions[token];
    if (!loggedInUser) {
      sendJson(res, 401, { message: 'Unauthorized' });
      return;
    }

    let dbUser = mentors.find(m => m.id === loggedInUser.id || m.email === loggedInUser.email);
    if (!dbUser) {
      dbUser = users.students.find(s => s.id === loggedInUser.id || s.email === loggedInUser.email);
    }
    if (dbUser && dbUser.isActive === false) {
      sendJson(res, 401, { message: 'Your account is blocked. Please contact support.' });
      return;
    }

    if (dbUser) {
      loggedInUser.name = dbUser.name;
      loggedInUser.email = dbUser.email;
      if (loggedInUser.role === 'MENTOR') {
        loggedInUser.mentor = dbUser;
      }
    }

    sendJson(res, 200, loggedInUser);
    return;
  }

  const mockResetTokens = {};

  // FORGOT / RESET PASSWORD
  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    parseBody(req, (data) => {
      const email = data.email;
      if (email) {
        const token = 'mock_reset_' + Math.random().toString(36).substring(2, 10);
        mockResetTokens[token] = {
          email: email,
          expiry: Date.now() + 3600000
        };
        console.log("=========================================");
        console.log("MOCK PASSWORD RESET EMAIL SENT TO: " + email);
        console.log("Reset Link: http://localhost:3000/reset-password?token=" + token);
        console.log("=========================================");
      }
      sendJson(res, 200, { message: 'Password reset link sent' });
    });
    return;
  }

  if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
    parseBody(req, (data) => {
      const { token, password } = data;
      const record = mockResetTokens[token];
      if (!record || record.expiry < Date.now()) {
        sendJson(res, 400, { message: 'Invalid or expired token' });
        return;
      }
      console.log(`Password reset successfully for ${record.email}`);
      delete mockResetTokens[token];
      sendJson(res, 200, { message: 'Password reset successfully' });
    });
    return;
  }

  // MENTOR ENDPOINTS
  if (pathname === '/api/mentors/profile' && req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    const loggedInUser = activeSessions[token] || mentors[0];
    
    if (!loggedInUser) {
      sendJson(res, 401, { message: 'Unauthorized' });
      return;
    }
    
    const mentor = mentors.find(m => m.id === loggedInUser.id || m.email === loggedInUser.email);
    if (!mentor) {
      sendJson(res, 404, { message: 'Mentor profile not found' });
      return;
    }
    sendJson(res, 200, mentor);
    return;
  }

  if (pathname.startsWith('/api/mentors/') && req.method === 'PUT') {
    const id = parseInt(pathname.split('/')[3]);
    parseBody(req, (data) => {
      const mentorIndex = mentors.findIndex(m => m.id === id);
      if (mentorIndex !== -1) {
        mentors[mentorIndex] = { ...mentors[mentorIndex], ...data };
        sendJson(res, 200, mentors[mentorIndex]);
      } else {
        sendJson(res, 404, { message: 'Mentor not found' });
      }
    });
    return;
  }

  if (pathname === '/api/mentors/upload-photo' && req.method === 'POST') {
    sendJson(res, 200, { message: 'Photo uploaded successfully', photoUrl: '/uploads/mentors/mock-photo.jpg' });
    return;
  }

  if (pathname === '/api/mentors/upload-document' && req.method === 'POST') {
    sendJson(res, 200, { message: 'Document uploaded successfully', supportiveDocumentUrl: '/uploads/mentors/mock-document.pdf' });
    return;
  }

  if (pathname === '/api/mentors' && req.method === 'GET') {
    let filtered = [...mentors];
    if (query.domain) {
      filtered = filtered.filter(m => m.domain === query.domain);
    }
    if (query.minExperience) {
      filtered = filtered.filter(m => m.yearsOfExperience >= parseInt(query.minExperience));
    }
    if (query.maxPrice) {
      filtered = filtered.filter(m => m.sessionPrice <= parseInt(query.maxPrice));
    }
    sendJson(res, 200, filtered);
    return;
  }

  if (pathname.startsWith('/api/mentors/') && req.method === 'GET') {
    const id = parseInt(pathname.split('/')[3]);
    const mentor = mentors.find(m => m.id === id);
    if (!mentor) {
      sendJson(res, 404, { message: 'Mentor not found' });
      return;
    }
    sendJson(res, 200, mentor);
    return;
  }

  // BOOKINGS ENDPOINTS
  if (pathname === '/api/bookings' && req.method === 'GET') {
    sendJson(res, 200, bookings);
    return;
  }

  if (pathname === '/api/bookings' && req.method === 'POST') {
    parseBody(req, (data) => {
      const booking = {
        id: bookings.length + 1,
        ...data,
        studentId: 1,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      bookings.push(booking);
      sendJson(res, 201, booking);
    });
    return;
  }

  if (pathname.includes('/api/bookings/available-slots/') && req.method === 'GET') {
    const parts = pathname.split('/');
    const mentorId = parseInt(parts[parts.length - 1]);
    const dateParam = query.date;
    
    let allSlots = [];
    if (dateParam) {
      try {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const dayOfWeek = days[new Date(dateParam).getDay()];
        const configuredSlots = availabilitySlots.filter(s => s.mentorId === mentorId && s.dayOfWeek === dayOfWeek);
        allSlots = configuredSlots.map(s => `${s.startTime}-${s.endTime}`);
      } catch (err) {
        // Keep empty
      }
    }
    
    const bookedSlots = bookings
      .filter(b => parseInt(b.mentorId) === mentorId && b.sessionDate === dateParam && b.status !== 'REJECTED')
      .map(b => b.timeSlot);
      
    const available = allSlots.filter(s => !bookedSlots.includes(s));
    sendJson(res, 200, available);
    return;
  }

  if (pathname.includes('/api/bookings/') && pathname.includes('/approve') && req.method === 'PUT') {
    const id = parseInt(pathname.split('/')[3]);
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'APPROVED';
      const randomHash = Math.random().toString(36).substring(2, 10);
      booking.meetingLink = `https://meet.jit.si/CareerMitra-Session-${id}-${randomHash}`;
      sendJson(res, 200, booking);
    } else {
      sendJson(res, 404, { message: 'Booking not found' });
    }
    return;
  }

  if (pathname.includes('/api/bookings/') && pathname.includes('/complete') && req.method === 'PUT') {
    const id = parseInt(pathname.split('/')[3]);
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'COMPLETED';
      sendJson(res, 200, booking);
    } else {
      sendJson(res, 404, { message: 'Booking not found' });
    }
    return;
  }

  // ADMIN ENDPOINTS
  if (pathname === '/api/admin/dashboard' && req.method === 'GET') {
    const totalRev = bookings.reduce((sum, b) => sum + (b.amount || 0), 0) + 4500;
    sendJson(res, 200, {
      totalUsers: users.students.length + users.mentors.length,
      totalMentors: users.mentors.length,
      totalSessions: bookings.length + 2,
      totalRevenue: totalRev,
      platformEarnings: totalRev * 0.15
    });
    return;
  }

  if (pathname === '/api/admin/users' && req.method === 'GET') {
    const list = [];
    users.students.forEach(s => {
      list.push({
        id: s.id,
        name: s.name,
        email: s.email,
        role: 'STUDENT',
        isActive: s.isActive !== false,
        student: {
          id: s.id,
          name: s.name,
          bio: s.bio || 'Aspiring Software Engineer',
          college: s.college || 'MIT',
          major: s.major || 'Computer Science',
          yearOfStudy: s.yearOfStudy || 3
        }
      });
    });
    mentors.forEach(m => {
      list.push({
        id: m.id,
        name: m.name,
        email: m.email,
        role: 'MENTOR',
        isActive: m.isActive !== false,
        mentor: m
      });
    });
    sendJson(res, 200, list);
    return;
  }

  if (pathname === '/api/admin/mentors' && req.method === 'GET') {
    sendJson(res, 200, mentors);
    return;
  }

  if (pathname.startsWith('/api/admin/users/') && pathname.endsWith('/block') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[4]);
    let user = users.students.find(s => s.id === id);
    if (!user) {
      user = mentors.find(m => m.id === id);
    }
    if (user) {
      user.isActive = false;
      sendJson(res, 200, { message: 'User blocked' });
    } else {
      sendJson(res, 404, { message: 'User not found' });
    }
    return;
  }

  if (pathname.startsWith('/api/admin/users/') && pathname.endsWith('/unblock') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[4]);
    let user = users.students.find(s => s.id === id);
    if (!user) {
      user = mentors.find(m => m.id === id);
    }
    if (user) {
      user.isActive = true;
      sendJson(res, 200, { message: 'User unblocked' });
    } else {
      sendJson(res, 404, { message: 'User not found' });
    }
    return;
  }

  if (pathname.startsWith('/api/admin/mentors/') && pathname.endsWith('/approve') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[4]);
    const mentor = mentors.find(m => m.id === id);
    if (mentor) {
      mentor.status = 'APPROVED';
      sendJson(res, 200, { message: 'Mentor approved' });
    } else {
      sendJson(res, 404, { message: 'Mentor not found' });
    }
    return;
  }

  if (pathname.startsWith('/api/admin/mentors/') && pathname.endsWith('/reject') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[4]);
    const mentor = mentors.find(m => m.id === id);
    if (mentor) {
      mentor.status = 'REJECTED';
      sendJson(res, 200, { message: 'Mentor rejected' });
    } else {
      sendJson(res, 404, { message: 'Mentor not found' });
    }
    return;
  }

  // REVIEWS
  if (pathname === '/api/reviews' && req.method === 'POST') {
    parseBody(req, (data) => {
      sendJson(res, 201, {
        id: Date.now(),
        ...data,
        studentName: 'John Student'
      });
    });
    return;
  }

  if (pathname.includes('/api/reviews/mentor/') && req.method === 'GET') {
    sendJson(res, 200, []);
    return;
  }

  // PAYMENTS
  if (pathname === '/api/payments' && req.method === 'POST') {
    parseBody(req, (data) => {
      sendJson(res, 201, {
        id: Date.now(),
        ...data,
        razorpayOrderId: 'order_' + Date.now(),
        status: 'PENDING'
      });
    });
    return;
  }

  if (pathname === '/api/payments/verify' && req.method === 'POST') {
    sendJson(res, 200, { message: 'Payment verified successfully' });
    return;
  }

  if (pathname === '/api/payments/history' && req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    const loggedInUser = activeSessions[token] || users.mentors[0];
    const role = loggedInUser?.role || 'MENTOR';

    const basePayments = [
      { id: 1, bookingId: 1, amount: role === 'MENTOR' ? 2000 * 0.85 : 2000, status: 'COMPLETED', createdAt: new Date(Date.now() - 2*24*3600*1000).toISOString() },
      { id: 2, bookingId: 2, amount: role === 'MENTOR' ? 2500 * 0.85 : 2500, status: 'COMPLETED', createdAt: new Date(Date.now() - 24*3600*1000).toISOString() }
    ];

    const extraPayments = bookings.map((b, idx) => ({
      id: 3 + idx,
      bookingId: b.id,
      amount: role === 'MENTOR' ? (b.amount || 0) * 0.85 : (b.amount || 0),
      status: b.status === 'COMPLETED' || b.status === 'APPROVED' ? 'COMPLETED' : 'PENDING',
      createdAt: b.createdAt || new Date().toISOString()
    }));

    sendJson(res, 200, [...basePayments, ...extraPayments]);
    return;
  }

  // AVAILABILITY
  if (pathname.startsWith('/api/availability/') && req.method === 'GET') {
    const mentorId = parseInt(pathname.split('/')[3]);
    const list = availabilitySlots.filter(s => s.mentorId === mentorId);
    sendJson(res, 200, list);
    return;
  }

  if (pathname === '/api/availability' && req.method === 'POST') {
    parseBody(req, (data) => {
      const { mentorId, dayOfWeek, startTime, endTime } = data;
      if (!startTime || !endTime) {
        sendJson(res, 400, { message: 'Start time and end time are required' });
        return;
      }
      if (startTime >= endTime) {
        sendJson(res, 400, { message: 'Start time must be before end time' });
        return;
      }
      const newSlot = {
        id: nextAvailabilityId++,
        mentorId: parseInt(mentorId),
        dayOfWeek: (dayOfWeek || 'MONDAY').toUpperCase(),
        startTime,
        endTime
      };
      availabilitySlots.push(newSlot);
      sendJson(res, 201, newSlot);
    });
    return;
  }

  if (pathname.startsWith('/api/availability/') && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/')[3]);
    const idx = availabilitySlots.findIndex(s => s.id === id);
    if (idx !== -1) {
      availabilitySlots.splice(idx, 1);
      sendJson(res, 200, { message: 'Availability deleted' });
    } else {
      sendJson(res, 404, { message: 'Availability slot not found' });
    }
    return;
  }

  // WEBINARS
  if (pathname === '/api/webinars' && req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    const loggedInUser = activeSessions[token] || { id: 1, role: 'STUDENT' };
    const list = webinars.map(w => {
      const isRegistered = webinarRegistrations.some(r => r.webinarId === w.id && r.studentId === loggedInUser.id);
      return { ...w, isRegistered };
    });
    sendJson(res, 200, list);
    return;
  }

  if (pathname === '/api/webinars' && req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    const loggedInUser = activeSessions[token];
    if (!loggedInUser || loggedInUser.role !== 'MENTOR') {
      sendJson(res, 403, { message: 'Only mentors can create webinars' });
      return;
    }
    parseBody(req, (data) => {
      const price = parseFloat(data.price) || 0;
      if (price < 0) {
        sendJson(res, 400, { message: 'Price cannot be negative' });
        return;
      }
      const newWebinar = {
        id: webinars.length + 1,
        title: data.title || 'Untitled Webinar',
        description: data.description || '',
        mentorId: loggedInUser.id,
        mentorName: loggedInUser.name,
        sessionDate: data.sessionDate,
        timeSlot: data.timeSlot,
        price: price,
        capacityLimit: parseInt(data.capacityLimit) || 100,
        registeredCount: 0,
        status: 'UPCOMING',
        meetingLink: ''
      };
      webinars.push(newWebinar);
      sendJson(res, 201, newWebinar);
    });
    return;
  }

  if (pathname.startsWith('/api/webinars/') && pathname.endsWith('/register') && req.method === 'POST') {
    const parts = pathname.split('/');
    const id = parseInt(parts[3]);
    const token = req.headers.authorization?.split(' ')[1];
    const loggedInUser = activeSessions[token] || { id: 1, name: 'John Student', email: 'student@example.com', role: 'STUDENT' };
    
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) {
      sendJson(res, 404, { message: 'Webinar not found' });
      return;
    }
    
    const exists = webinarRegistrations.some(r => r.webinarId === id && r.studentId === loggedInUser.id);
    if (exists) {
      sendJson(res, 400, { message: 'Already registered' });
      return;
    }
    
    if (webinar.registeredCount >= webinar.capacityLimit) {
      sendJson(res, 400, { message: 'Webinar is full' });
      return;
    }
    
    const registration = {
      id: webinarRegistrations.length + 1,
      webinarId: id,
      studentId: loggedInUser.id,
      studentName: loggedInUser.name,
      studentEmail: loggedInUser.email,
      registeredAt: new Date().toISOString()
    };
    webinarRegistrations.push(registration);
    webinar.registeredCount += 1;
    
    sendJson(res, 200, { message: 'Successfully registered', webinar });
    return;
  }

  if (pathname.startsWith('/api/webinars/') && pathname.endsWith('/start') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[3]);
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) {
      sendJson(res, 404, { message: 'Webinar not found' });
      return;
    }
    webinar.status = 'ACTIVE';
    const randomHash = Math.random().toString(36).substring(2, 10);
    webinar.meetingLink = `https://meet.jit.si/CareerMitra-Webinar-${id}-${randomHash}`;
    sendJson(res, 200, webinar);
    return;
  }

  if (pathname.startsWith('/api/webinars/') && pathname.endsWith('/complete') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[3]);
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) {
      sendJson(res, 404, { message: 'Webinar not found' });
      return;
    }
    webinar.status = 'COMPLETED';
    sendJson(res, 200, webinar);
    return;
  }

  if (pathname.startsWith('/api/webinars/') && pathname.endsWith('/cancel') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parseInt(parts[3]);
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) {
      sendJson(res, 404, { message: 'Webinar not found' });
      return;
    }
    webinar.status = 'CANCELLED';
    sendJson(res, 200, webinar);
    return;
  }

  // Default
  sendJson(res, 404, { message: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`\n✅ Career Mitra Mock Backend Started!\n`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:\n`);
  console.log(`   Auth:`);
  console.log(`   ├─ POST   /api/auth/login`);
  console.log(`   ├─ POST   /api/auth/signup`);
  console.log(`   └─ GET    /api/auth/verify\n`);
  console.log(`   Mentors:`);
  console.log(`   ├─ GET    /api/mentors`);
  console.log(`   └─ GET    /api/mentors/:id\n`);
  console.log(`   Bookings:`);
  console.log(`   ├─ GET    /api/bookings`);
  console.log(`   ├─ POST   /api/bookings`);
  console.log(`   └─ GET    /api/bookings/available-slots/:id\n`);
  console.log(`   Admin:`);
  console.log(`   └─ GET    /api/admin/dashboard\n`);
  console.log(`💡 Frontend should connect to: http://localhost:${PORT}\n`);
});
