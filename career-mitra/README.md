# Career Mitra - Student Mentorship Platform

A modern, full-stack web application that connects students with industry experts and mentors for career guidance and professional development.

## 🎯 Features

### Core Features
- **User Authentication**: JWT-based secure authentication with role-based access control (Student, Mentor, Admin)
- **Student Dashboard**: Browse and search mentors, book sessions, track bookings, write reviews
- **Mentor Dashboard**: Manage profile, set availability, approve/reject bookings, track earnings
- **Admin Dashboard**: Manage users, approve mentors, monitor sessions and payments
- **Session Booking**: Easy booking system with available time slots
- **Payment Integration**: Razorpay integration for secure payment processing
- **Review & Rating**: Students can rate and review mentors after sessions
- **Responsive UI**: Mobile-friendly design with modern UI/UX

## 🛠️ Tech Stack

### Frontend
- React.js 18+
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- Context API for state management
- React Icons for UI icons
- React Toastify for notifications

### Backend
- Spring Boot 3.1+
- Spring Security with JWT
- Spring Data JPA with Hibernate
- MySQL 8.0+
- ModelMapper for DTO conversion
- Maven for dependency management

### Database
- MySQL 8.0+
- Relational schema with proper foreign keys and indexes

## 📁 Project Structure

```
career-mitra/
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # Context API state
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Layout components
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Spring Boot Backend
│   ├── src/main/java/com/careermitra/
│   │   ├── controller/      # REST API controllers
│   │   ├── service/         # Business logic services
│   │   ├── repository/      # JPA repositories
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── security/        # Security configuration
│   │   ├── config/          # Application configuration
│   │   └── exception/       # Exception handling
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── docs/                     # Documentation
    └── database_schema.sql   # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Java 17+
- MySQL 8.0+
- Git

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update REACT_APP_API_URL if needed
# REACT_APP_API_URL=http://localhost:8080/api

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Backend Setup

```bash
cd backend

# Update database configuration in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/career_mitra
spring.datasource.username=root
spring.datasource.password=your_password

# Create database
mysql -u root -p
CREATE DATABASE career_mitra;
USE career_mitra;
source docs/database_schema.sql;

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/forgot-password` - Request password reset

### Mentors
- `GET /api/mentors` - Get all approved mentors (with filters)
- `GET /api/mentors/{id}` - Get mentor profile
- `POST /api/mentors` - Create mentor profile
- `PUT /api/mentors/{id}` - Update mentor profile
- `POST /api/mentors/upload-photo` - Upload mentor photo

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}/approve` - Approve booking (mentor)
- `PUT /api/bookings/{id}/reject` - Reject booking (mentor)
- `PUT /api/bookings/{id}/complete` - Complete booking
- `GET /api/bookings/available-slots/{mentorId}` - Get available time slots

### Reviews & Ratings
- `GET /api/reviews/mentor/{mentorId}` - Get mentor reviews
- `POST /api/reviews` - Create review (student)

### Payments
- `POST /api/payments` - Create payment order
- `POST /api/payments/verify` - Verify payment

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/mentors` - Manage mentors
- `PUT /api/admin/mentors/{id}/approve` - Approve mentor
- `PUT /api/admin/users/{id}/block` - Block user

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with BCrypt
- Role-based access control (RBAC)
- Protected API endpoints
- CORS configuration
- Input validation
- SQL injection prevention with prepared statements

## 💾 Database Schema

### Main Tables
- **users**: Stores user information (email, password, role)
- **students**: Student-specific data (college, major, year)
- **mentors**: Mentor profiles (bio, experience, pricing, skills)
- **bookings**: Session bookings between students and mentors
- **payments**: Payment records with Razorpay integration
- **reviews**: Student reviews and ratings for mentors
- **availability_slots**: Mentor availability schedule

## 🎨 UI/UX Features

- Clean and modern dashboard layouts
- Responsive grid layouts for mentor browsing
- Smooth animations and transitions
- Intuitive navigation
- Mobile-friendly design
- Professional color scheme
- Reusable component library

## 📱 Responsive Pages

- Landing page with hero section
- Authentication pages (login/signup)
- Student dashboard and mentor listing
- Mentor profile with reviews
- Booking interface
- Session history
- Mentor dashboard with booking requests
- Admin management panels

## 🔄 Workflow

### Student Flow
1. Sign up as a student
2. Browse mentors with filters
3. View mentor profiles and reviews
4. Book a mentorship session
5. Make payment via Razorpay
6. Track upcoming sessions
7. Rate and review after session completion

### Mentor Flow
1. Sign up as a mentor
2. Complete profile with bio, skills, and pricing
3. Set availability schedule
4. Review booking requests
5. Approve/reject sessions
6. Track completed sessions
7. Monitor earnings

### Admin Flow
1. Login as admin
2. View dashboard statistics
3. Manage user accounts
4. Approve/reject mentor applications
5. Monitor all bookings and payments
6. Generate reports

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload build folder to Vercel or Netlify
```

### Backend (AWS/Heroku)
```bash
mvn clean package
# Deploy JAR file to cloud platform
```

## 🔧 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/career_mitra
spring.datasource.username=root
spring.datasource.password=password
jwt.secret=your_secret_key
jwt.expiration=86400000
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@careermitra.com or open an issue on GitHub.

---

**Career Mitra** - Connecting Students with Industry Mentors 🎓
