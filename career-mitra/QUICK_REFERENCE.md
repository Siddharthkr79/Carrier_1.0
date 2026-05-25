# Quick Reference Guide - Career Mitra

## 📌 Quick Start (5 Minutes)

### Prerequisites
```bash
# Verify installations
java -version          # Should be Java 17+
node --version         # Should be Node 16+
npm --version          # Should be npm 8+
mysql --version        # Should be MySQL 8.0+
```

### Backend Start
```bash
cd backend

# Update database credentials in src/main/resources/application.properties
# Create database: CREATE DATABASE career_mitra;

mvn clean install
mvn spring-boot:run
# Backend runs on: http://localhost:8080
```

### Frontend Start
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
echo "REACT_APP_RAZORPAY_KEY_ID=your_key_id" >> .env

# Start development
npm start
# Frontend runs on: http://localhost:3000
```

---

## 🗂️ Project Structure Quick Map

```
career-mitra/
├── README.md                  # Project overview
├── SETUP.md                   # Detailed setup guide
├── TROUBLESHOOTING.md         # Common issues & solutions
├── IMPLEMENTATION_SUMMARY.md  # What's implemented
├── .gitignore                 # Git ignore rules
│
├── frontend/                  # React Frontend
│   ├── package.json          # Dependencies
│   ├── .env.example          # Environment template
│   ├── tailwind.config.js    # Tailwind config
│   ├── postcss.config.js     # PostCSS config
│   ├── public/
│   └── src/
│       ├── App.jsx           # Main router (30+ routes)
│       ├── index.js          # Entry point
│       ├── index.css         # Global styles
│       ├── components/       # Reusable components
│       ├── pages/            # Page components
│       ├── context/          # Auth state management
│       ├── services/         # API calls
│       ├── hooks/            # Custom hooks
│       ├── layouts/          # Layout components
│       └── utils/            # Utility functions
│
├── backend/                   # Spring Boot Backend
│   ├── pom.xml              # Maven dependencies
│   └── src/main/
│       ├── java/com/careermitra/
│       │   ├── CareerMitraApplication.java
│       │   ├── controller/  # REST endpoints (7 files)
│       │   ├── service/     # Business logic (6 files)
│       │   ├── repository/  # Data access (1 file)
│       │   ├── entity/      # Database models (1 file)
│       │   ├── dto/         # Data transfer (1 file)
│       │   ├── security/    # JWT provider (1 file)
│       │   ├── config/      # Configuration
│       │   └── exception/   # Exception handling (1 file)
│       └── resources/
│           └── application.properties  # Config
│
└── docs/                      # Documentation
    ├── database_schema.sql   # Database DDL
    └── API_DOCUMENTATION.md  # Complete API reference
```

---

## 🔑 Key Routes

### Frontend Routes
```
Public:
  /                          Home/Landing
  /login                     Login page
  /signup                    Sign up page
  /forgot-password           Password reset

Student:
  /mentors                   Browse mentors
  /mentors/{id}              Mentor profile
  /bookings/new/{mentorId}   Create booking
  /student/dashboard         Dashboard
  /bookings                  My bookings

Mentor:
  /mentor/dashboard          Dashboard
  /mentor/profile            Edit profile
  /mentor/bookings           Booking requests
  /mentor/earnings           Earnings tracking

Admin:
  /admin/dashboard           Dashboard
  /admin/users               Manage users
  /admin/mentors             Manage mentors
  /admin/bookings            View bookings
  /admin/payments            View payments
```

### Backend API Base
```
http://localhost:8080/api/
```

---

## 🔌 API Endpoints Quick Reference

### Auth
```
POST   /auth/signup
POST   /auth/login
GET    /auth/verify
POST   /auth/forgot-password
```

### Mentors
```
GET    /mentors                    (with filters)
GET    /mentors/{id}
POST   /mentors
PUT    /mentors/{id}
POST   /mentors/upload-photo
```

### Bookings
```
GET    /bookings
POST   /bookings
PUT    /bookings/{id}/approve
PUT    /bookings/{id}/reject
PUT    /bookings/{id}/complete
GET    /bookings/available-slots/{mentorId}
```

### Reviews
```
GET    /reviews/mentor/{mentorId}
POST   /reviews
```

### Payments
```
POST   /payments
POST   /payments/verify
GET    /payments/history
```

### Availability
```
GET    /availability/{mentorId}
POST   /availability
DELETE /availability/{id}
```

### Admin
```
GET    /admin/dashboard
PUT    /admin/mentors/{id}/approve
PUT    /admin/users/{id}/block
```

---

## 🗄️ Database Tables

```sql
users              -- Core user data
├── students       -- Student profiles
├── mentors        -- Mentor profiles
│   ├── reviews    -- Mentor ratings
│   └── availability_slots
└── bookings       -- Sessions
    ├── payments   -- Payment records
    └── reviews    -- Student reviews
```

### Key Relationships
- User → Student (1:1)
- User → Mentor (1:1)
- Student → Bookings (1:N)
- Mentor → Bookings (1:N)
- Booking → Payment (1:1)
- Booking → Review (1:1)

---

## 🛠️ Common Commands

### Frontend
```bash
npm install          # Install dependencies
npm start            # Start dev server
npm build            # Build for production
npm test             # Run tests
npm run eject        # Eject from CRA (not reversible!)
```

### Backend
```bash
mvn clean            # Clean build directory
mvn install          # Install dependencies
mvn compile          # Compile code
mvn test             # Run tests
mvn package          # Create JAR
mvn spring-boot:run  # Run application
```

### Database
```bash
mysql -u root -p                              # Connect to MySQL
CREATE DATABASE career_mitra;                 # Create database
source docs/database_schema.sql;              # Load schema
SHOW TABLES;                                  # List tables
mysql -u root -p career_mitra < docs/database_schema.sql
```

---

## 🔐 Authentication Flow

### Login
```
1. User enters email/password
2. Frontend: POST /auth/login
3. Backend: Validate credentials, generate JWT
4. Frontend: Save token to localStorage
5. Axios interceptor: Add token to all requests
6. Frontend: Redirect based on role
```

### Protected Routes
```
1. App.jsx checks user role
2. ProtectedRoute wrapper redirects if unauthorized
3. API interceptor redirects to /login on 401
```

---

## 📝 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/career_mitra
spring.datasource.username=root
spring.datasource.password=password
jwt.secret=your_secret_key
jwt.expiration=86400000
app.cors.allowedOrigins=http://localhost:3000
```

---

## 🐛 Debug Mode

### Frontend (Browser Console)
```javascript
// Check token
localStorage.getItem('token')

// Check user
localStorage.getItem('user')

// Check API calls (Network tab)
```

### Backend (Logs)
```bash
# Watch logs in real-time
tail -f target/career-mitra.log

# Or enable debug in application.properties
logging.level.root=DEBUG
logging.level.com.careermitra=DEBUG
```

---

## 📊 Feature Checklist

### Authentication
- ✅ Login/Signup
- ✅ JWT tokens
- ✅ Role-based access
- ✅ Password hashing
- ✅ Token verification

### Student Features
- ✅ Browse mentors
- ✅ Search & filter
- ✅ View profiles
- ✅ Book sessions
- ✅ Make payments
- ✅ Write reviews

### Mentor Features
- ✅ Profile management
- ✅ Availability scheduling
- ✅ Booking requests
- ✅ Earnings tracking
- ✅ Review management

### Admin Features
- ✅ Dashboard stats
- ✅ User management
- ✅ Mentor approval
- ✅ Booking monitoring
- ✅ Payment tracking

---

## 🚀 Deployment Commands

### Frontend
```bash
npm run build
# Deploy 'build' folder to Vercel/Netlify
```

### Backend
```bash
mvn clean package
# Deploy 'career-mitra-backend-1.0.0.jar' to AWS/Heroku
java -jar career-mitra-backend-1.0.0.jar
```

---

## 📚 Documentation Files

1. **README.md** - Project overview (start here)
2. **SETUP.md** - Detailed installation steps
3. **TROUBLESHOOTING.md** - Common problems & solutions
4. **IMPLEMENTATION_SUMMARY.md** - What's implemented
5. **API_DOCUMENTATION.md** - Complete API reference
6. **database_schema.sql** - Database structure

---

## 🔍 Code Navigation

### Frontend Key Files
- `App.jsx` - All routes
- `context/AuthContext.jsx` - Auth state
- `services/api.js` - API configuration
- `pages/*/` - Page components

### Backend Key Files
- `controller/*Controller.java` - REST endpoints
- `service/*Service.java` - Business logic
- `entity/*.java` - Database models
- `repository/*.java` - Data queries

---

## 🎯 First Task Checklist

- [ ] Read README.md
- [ ] Follow SETUP.md steps
- [ ] Create database
- [ ] Update .env files
- [ ] Start backend (mvn spring-boot:run)
- [ ] Start frontend (npm start)
- [ ] Test login/signup
- [ ] Browse mentors
- [ ] Create test booking
- [ ] Check admin dashboard

---

## 💡 Pro Tips

1. **Add to favorites**: Bookmark this guide for quick reference
2. **Keep logs running**: Have terminal with logs open while testing
3. **Use Postman**: Test API endpoints with Postman before frontend
4. **Database backup**: Regular backups prevent data loss
5. **Git commits**: Commit frequently during development
6. **Code formatting**: Use IDE auto-format before committing

---

## 📞 Quick Help

**Backend won't start?**
→ Check Java version, MySQL connection, ports

**Frontend won't start?**
→ Check Node version, npm install, .env file

**Can't connect to API?**
→ Check CORS config, API URL in .env, backend running

**Database issues?**
→ Check MySQL running, credentials, database exists

**See TROUBLESHOOTING.md for detailed solutions**

---

**Last Updated**: May 2024
**Career Mitra v1.0.0**
