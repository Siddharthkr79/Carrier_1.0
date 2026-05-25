# Setup Instructions for Career Mitra

## Prerequisites

### System Requirements
- OS: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- RAM: 4GB minimum (8GB recommended)
- Disk Space: 2GB free
- Internet Connection

### Software Requirements

#### 1. Java Development Kit (JDK)
- **Version**: Java 17+
- **Download**: https://www.oracle.com/java/technologies/downloads/
- **Verify Installation**:
  ```bash
  java -version
  javac -version
  ```

#### 2. Node.js
- **Version**: 16+
- **Download**: https://nodejs.org/
- **Verify Installation**:
  ```bash
  node --version
  npm --version
  ```

#### 3. MySQL Server
- **Version**: 8.0+
- **Download**: https://dev.mysql.com/downloads/mysql/
- **Verify Installation**:
  ```bash
  mysql --version
  ```

#### 4. Maven (Optional - comes with Spring Boot)
- **Version**: 3.6+
- **Download**: https://maven.apache.org/download.cgi
- **Verify Installation**:
  ```bash
  mvn --version
  ```

#### 5. Git
- **Download**: https://git-scm.com/
- **Verify Installation**:
  ```bash
  git --version
  ```

---

## Step-by-Step Installation

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd career-mitra
```

### Step 2: Database Setup

#### Create Database and Tables

```bash
# Start MySQL Server
mysql -u root -p

# Create database
CREATE DATABASE career_mitra;
USE career_mitra;

# Import schema
source docs/database_schema.sql;

# Verify tables
SHOW TABLES;
```

Or run the SQL script directly:

```bash
mysql -u root -p career_mitra < docs/database_schema.sql
```

### Step 3: Backend Setup

#### Navigate to Backend
```bash
cd backend
```

#### Update Configuration
Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/career_mitra?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JWT Configuration (keep default or change)
jwt.secret=careermitra_secret_key_2024_very_long_and_secure_key_for_production
jwt.expiration=86400000

# Server Port
server.port=8080
```

#### Build Project
```bash
# Clean previous builds
mvn clean

# Install dependencies and build
mvn install
```

#### Run Backend Server
```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Run JAR directly
java -jar target/career-mitra-backend-1.0.0.jar
```

The backend will start at: `http://localhost:8080`

### Step 4: Frontend Setup

#### Navigate to Frontend
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Update Environment Variables
Create `.env` file in frontend directory:

```bash
cp .env.example .env
```

Update `.env` content:
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will start at: `http://localhost:3000`

---

## Configuration Guide

### Database Configuration

File: `backend/src/main/resources/application.properties`

```properties
# MySQL Connection
spring.datasource.url=jdbc:mysql://localhost:3306/career_mitra
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### JWT Configuration

```properties
# JWT Token Configuration
jwt.secret=your_secret_key_here
jwt.expiration=86400000  # 24 hours in milliseconds
```

### CORS Configuration

```properties
# Allowed Origins
app.cors.allowedOrigins=http://localhost:3000,http://localhost:3001
```

### Razorpay Configuration

File: `frontend/.env`

```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Get your Razorpay key from: https://dashboard.razorpay.com/

---

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Address already in use`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Issue: MySQL Connection Failed

**Error**: `Access denied for user 'root'`

**Solution**:
```bash
# Verify MySQL is running
mysql -u root -p

# Update password in application.properties
spring.datasource.password=your_correct_password
```

### Issue: Node Modules Not Installing

**Error**: `npm ERR!`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Issue: Maven Build Failure

**Error**: `BUILD FAILURE`

**Solution**:
```bash
# Clean and rebuild
mvn clean install -DskipTests

# Check Java version
java -version

# Update Maven if needed
mvn -version
```

### Issue: Tailwind CSS Not Working

**Error**: Styles not applied

**Solution**:
```bash
# In frontend directory
npm install -D tailwindcss postcss autoprefixer
npm run build
```

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
Update CORS configuration in backend:
```properties
app.cors.allowedOrigins=http://localhost:3000
```

---

## Running in Production

### Build Frontend
```bash
cd frontend
npm run build
# Upload 'build' folder to hosting
```

### Build Backend
```bash
cd backend
mvn clean package
# Deploy JAR file to server
java -jar career-mitra-backend-1.0.0.jar
```

### Environment Variables (Production)
Set these as environment variables or in `.env` file:
- `DATABASE_URL`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

---

## Testing the Application

### Test Login
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account as Student or Mentor
4. Login with credentials

### Test Mentor Features
1. Create account as Mentor
2. Complete profile with bio, skills, experience
3. Set availability
4. Wait for admin approval

### Test Booking
1. Login as Student
2. Browse mentors
3. Select a mentor
4. Book session
5. Make payment (use Razorpay test cards)

### Test Admin
1. Login as Admin (manual database insert)
2. Go to /admin/dashboard
3. Manage users, mentors, bookings

---

## Important Notes

1. **Never commit secrets**: Keep API keys and passwords out of version control
2. **Database backup**: Regularly backup your MySQL database
3. **SSL/TLS**: Use HTTPS in production
4. **Environment-specific config**: Use different configs for dev, staging, production
5. **Logging**: Enable debug logging during development

---

## Helpful Commands

### Backend
```bash
# Start backend
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package

# View logs
tail -f target/career-mitra-backend-1.0.0.jar
```

### Frontend
```bash
# Start development
npm start

# Build production
npm run build

# Run tests
npm test

# Clean dependencies
npm ci
```

### Database
```bash
# Login to MySQL
mysql -u root -p

# Show all databases
SHOW DATABASES;

# Use database
USE career_mitra;

# Show all tables
SHOW TABLES;

# Backup database
mysqldump -u root -p career_mitra > backup.sql

# Restore database
mysql -u root -p career_mitra < backup.sql
```

---

## Support & Help

- Read documentation in `/docs` folder
- Check API documentation in `API_DOCUMENTATION.md`
- Review database schema in `database_schema.sql`
- Open GitHub issues for bugs
- Email: support@careermitra.com

---

**Last Updated**: May 2024
**Version**: 1.0.0
