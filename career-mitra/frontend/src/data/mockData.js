// Mock Data for Career Mitra Platform

export const mockMentors = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Senior Software Engineer',
    company: 'Google',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    skills: ['React', 'Node.js', 'System Design', 'Web Development', 'Placement Preparation', 'DSA & Coding', 'Technical Interviews'],
    experience: 12,
    rating: 4.9,
    reviews: 347,
    sessionFee: 2000,
    about: 'Passionate software engineer with 12+ years of experience in building scalable web applications. Specialized in React and backend technologies.',
    availability: ['Mon', 'Wed', 'Fri'],
    badge: 'Top Mentor'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Product Manager',
    company: 'Microsoft',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    skills: ['Product Strategy', 'Leadership', 'Agile', 'Data Analytics', 'CAT', 'Aptitude'],
    experience: 10,
    rating: 4.8,
    reviews: 285,
    sessionFee: 1800,
    about: 'Experienced product manager with expertise in building products that users love. Great mentor for career transitions.',
    availability: ['Tue', 'Thu', 'Sat'],
    badge: 'Verified'
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Data Scientist',
    company: 'Amazon',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    skills: ['Machine Learning', 'Python', 'Data Analysis', 'AI/ML', 'DSA & Coding', 'Technical Interviews', 'Mock Tests'],
    experience: 8,
    rating: 4.7,
    reviews: 215,
    sessionFee: 1500,
    about: 'Data science expert helping professionals transition into ML and AI roles.',
    availability: ['Mon', 'Wed', 'Thu'],
    badge: 'Top Mentor'
  },
  {
    id: 4,
    name: 'Neha Gupta',
    role: 'UX/UI Designer',
    company: 'Adobe',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    skills: ['UI Design', 'UX Research', 'Figma', 'Design Systems', 'Placement Preparation'],
    experience: 7,
    rating: 4.6,
    reviews: 178,
    sessionFee: 1200,
    about: 'Creative designer passionate about mentoring aspiring UX/UI designers.',
    availability: ['Tue', 'Thu', 'Fri'],
    badge: 'Verified'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'DevOps Engineer',
    company: 'Netflix',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Cloud Infrastructure', 'GATE'],
    experience: 9,
    rating: 4.9,
    reviews: 256,
    sessionFee: 1800,
    about: 'DevOps expert specializing in container orchestration and cloud solutions.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    badge: 'Top Mentor'
  },
  {
    id: 6,
    name: 'Anjali Verma',
    role: 'Business Analyst',
    company: 'Deloitte',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    skills: ['Business Analysis', 'Requirements Gathering', 'SQL', 'Excel', 'UPSC', 'SSC', 'Banking', 'Railway'],
    experience: 6,
    rating: 4.5,
    reviews: 142,
    sessionFee: 1000,
    about: 'Business analyst helping professionals understand the BA career path.',
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    badge: 'Verified'
  },
];

export const mockSessions = [
  {
    id: 1,
    mentorId: 1,
    mentorName: 'Rajesh Kumar',
    mentorImage: mockMentors[0].image,
    title: 'System Design Fundamentals',
    date: '2024-06-15',
    time: '14:00',
    duration: 60,
    status: 'confirmed',
    notes: 'We will discuss microservices architecture and design patterns.'
  },
  {
    id: 2,
    mentorId: 2,
    mentorName: 'Priya Sharma',
    mentorImage: mockMentors[1].image,
    title: 'Career Transition to PM',
    date: '2024-06-18',
    time: '10:00',
    duration: 45,
    status: 'completed',
    notes: 'Discussed the PM career path and transition strategies.'
  },
  {
    id: 3,
    mentorId: 3,
    mentorName: 'Amit Patel',
    mentorImage: mockMentors[2].image,
    title: 'Machine Learning Interview Prep',
    date: '2024-06-20',
    time: '15:30',
    duration: 60,
    status: 'pending',
    notes: 'Preparing for upcoming ML interviews.'
  },
];

export const mockReviews = [
  {
    id: 1,
    mentorId: 1,
    studentName: 'John Doe',
    rating: 5,
    comment: 'Excellent mentor! Rajesh helped me understand system design concepts clearly. Highly recommend!',
    date: '2024-05-20',
    studentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    mentorId: 1,
    studentName: 'Sarah Wilson',
    rating: 4,
    comment: 'Great session on React best practices. Very knowledgeable and patient.',
    date: '2024-05-15',
    studentImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    mentorId: 2,
    studentName: 'Mike Chen',
    rating: 5,
    comment: 'Priya is amazing! She gave me actionable advice for my PM transition. Worth every penny!',
    date: '2024-05-10',
    studentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
];

export const mockAvailabilitySlots = [
  { id: 1, time: '09:00 AM', available: true },
  { id: 2, time: '10:00 AM', available: false },
  { id: 3, time: '11:00 AM', available: true },
  { id: 4, time: '02:00 PM', available: true },
  { id: 5, time: '03:00 PM', available: false },
  { id: 6, time: '04:00 PM', available: true },
  { id: 7, time: '05:00 PM', available: true },
  { id: 8, time: '06:00 PM', available: false },
];

export const mockUserStats = {
  totalSessions: 12,
  completedSessions: 9,
  upcomingSessions: 2,
  totalSpent: 22500,
  averageRating: 4.8,
};

export const mockMentorStats = {
  totalSessions: 156,
  completedSessions: 149,
  pendingSessions: 3,
  totalEarnings: 312000,
  averageRating: 4.9,
  monthlyEarnings: 45000,
};

export const mockBookings = [
  {
    id: 1,
    mentorName: 'Rajesh Kumar',
    mentorRole: 'Senior Software Engineer',
    date: '2024-06-15',
    time: '14:00',
    duration: 60,
    fee: 2000,
    status: 'confirmed',
    sessionTitle: 'System Design Fundamentals'
  },
  {
    id: 2,
    mentorName: 'Priya Sharma',
    mentorRole: 'Product Manager',
    date: '2024-06-18',
    time: '10:00',
    duration: 45,
    fee: 1800,
    status: 'completed',
    sessionTitle: 'Career Transition to PM'
  },
];

export const mockPayments = [
  {
    id: 1,
    transactionId: 'TXN001',
    mentorName: 'Rajesh Kumar',
    amount: 2000,
    date: '2024-06-15',
    status: 'success',
    type: 'session'
  },
  {
    id: 2,
    transactionId: 'TXN002',
    mentorName: 'Priya Sharma',
    amount: 1800,
    date: '2024-06-18',
    status: 'success',
    type: 'session'
  },
];

export const mockAdminStats = {
  totalUsers: 5432,
  totalMentors: 342,
  activeBookings: 156,
  totalRevenue: 2345000,
  monthlyRevenue: 450000,
};

export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'student', status: 'active', joinDate: '2024-02-20' },
  { id: 3, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'mentor', status: 'verified', joinDate: '2023-12-10' },
  { id: 4, name: 'Priya Sharma', email: 'priya@example.com', role: 'mentor', status: 'verified', joinDate: '2023-11-05' },
  { id: 5, name: 'Mike Chen', email: 'mike@example.com', role: 'student', status: 'inactive', joinDate: '2024-03-01' },
];
