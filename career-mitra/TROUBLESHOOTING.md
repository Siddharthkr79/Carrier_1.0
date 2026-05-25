# Troubleshooting Guide for Career Mitra

## General Troubleshooting

### Issue: Application won't start
**Symptoms**: Error on startup, crash immediately

**Solution**:
1. Check Java version: `java -version` (should be 17+)
2. Check Node version: `node --version` (should be 16+)
3. Check MySQL is running: `mysql -u root -p`
4. Check ports are available: 8080 (backend), 3000 (frontend), 3306 (MySQL)

---

## Backend Issues

### Issue: Connection to Database Refused
**Error**: `com.mysql.jdbc.exceptions.jdbc4.MySQLNonTransientConnectionException`

**Causes & Solutions**:
```bash
# 1. MySQL service not running
# macOS
brew services start mysql

# Linux
sudo service mysql start

# Windows
net start MySQL80

# 2. Wrong credentials
# Check username and password in application.properties

# 3. Database doesn't exist
mysql -u root -p
CREATE DATABASE career_mitra;
```

### Issue: Port 8080 Already in Use
**Error**: `java.net.BindException: Address already in use`

**Solutions**:
```bash
# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Or change port in application.properties
server.port=8081

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Maven Build Failure
**Error**: `BUILD FAILURE`

**Solutions**:
```bash
# Clear Maven cache
mvn clean

# Rebuild without tests
mvn clean install -DskipTests

# Check Java compiler
mvn -version
java -version

# Update Maven plugins
mvn help:describe -Dplugin=org.apache.maven.plugins:maven-compiler-plugin
```

### Issue: JWT Token Expired
**Error**: `401 Unauthorized: Token expired`

**Solution**:
1. Token expiration set in application.properties: `jwt.expiration=86400000` (24 hours)
2. User needs to login again to get new token
3. For testing, increase expiration time temporarily

### Issue: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
```bash
# Check CORS config in application.properties
app.cors.allowedOrigins=http://localhost:3000

# Or add multiple origins
app.cors.allowedOrigins=http://localhost:3000,http://localhost:3001,https://yourdomain.com

# For development, you can use wildcard (NOT for production)
app.cors.allowedOrigins=*
```

### Issue: Null Pointer Exception in Services
**Error**: `NullPointerException at [service method]`

**Solutions**:
1. Check entity relationships are properly initialized
2. Verify repository queries return non-null
3. Add null checks in service methods
4. Check database has seed data

### Issue: Duplicate Key Constraint Violation
**Error**: `Duplicate entry for key 'email'`

**Solution**:
```bash
# This means email already exists
# Use different email or:

# Delete duplicate and try again
DELETE FROM users WHERE email='test@example.com';
```

### Issue: Table Not Found
**Error**: `Table 'career_mitra.users' doesn't exist`

**Solution**:
```bash
# Check if database exists
SHOW DATABASES;

# Create and populate database
mysql -u root -p career_mitra < docs/database_schema.sql

# Verify tables created
USE career_mitra;
SHOW TABLES;
```

---

## Frontend Issues

### Issue: npm install Fails
**Error**: `npm ERR!`

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Remove lock files
rm package-lock.json

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install

# Or use npm ci for exact versions
npm ci
```

### Issue: React App Crashes on Startup
**Error**: `Error: Cannot find module 'react'`

**Solutions**:
```bash
# Reinstall all dependencies
npm install

# Check package.json has all dependencies
npm list

# Verify Node version
node --version
```

### Issue: Tailwind CSS Not Working
**Error**: Styles don't appear or are incomplete

**Solutions**:
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer

# Rebuild
npm run build

# Check tailwind.config.js has correct content paths
# Check index.css imports Tailwind directives

@tailwind base;
@tailwind components;
@tailwind utilities;

# Restart dev server
npm start
```

### Issue: Axios Can't Connect to Backend
**Error**: `Error: Network Error` or `ECONNREFUSED`

**Solutions**:
1. Check backend is running: `http://localhost:8080`
2. Check .env has correct API URL:
```env
REACT_APP_API_URL=http://localhost:8080/api
```
3. Check CORS is properly configured on backend
4. For production, update API URL:
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

### Issue: React Router Not Working
**Error**: Pages not loading, blank page, wrong URL

**Solutions**:
1. Check routes in App.jsx are correct
2. Verify component imports
3. Use relative paths for assets
4. Check ProtectedRoute logic
5. Clear browser cache

### Issue: Authentication Loop (Infinite Redirect)
**Error**: Gets redirected back to login constantly

**Solutions**:
```javascript
// Check AuthContext.jsx
// Make sure token is being saved to localStorage
// Verify token is valid and not expired
// Check ProtectedRoute component logic

// Debug:
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
```

### Issue: Form Validation Not Working
**Error**: Form submits with invalid data

**Solutions**:
1. Add HTML5 validation: `required`, `type="email"`, etc.
2. Add JavaScript validation in handlers
3. Check error messages display
4. Verify backend validation

### Issue: Images Not Loading
**Error**: Broken image icons or 404 errors

**Solutions**:
1. Check file paths are correct
2. Use relative paths from public folder
3. For mentor photos, implement proper upload handler
4. Check CORS for external images

### Issue: localStorage is Undefined
**Error**: `localStorage is not defined`

**Solution**:
```javascript
// Check if running in browser
if (typeof window !== 'undefined') {
  const token = window.localStorage.getItem('token');
}
```

### Issue: Port 3000 Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use different port
PORT=3001 npm start
```

---

## Database Issues

### Issue: Can't Connect to MySQL
**Error**: `Access denied for user 'root'@'localhost'`

**Solutions**:
```bash
# Verify MySQL is running
mysql -u root -p
# Enter password

# Check MySQL service status
# macOS
brew services list

# Reset MySQL password (if forgotten)
# Stop MySQL, start in safe mode, update password
```

### Issue: Database Locked
**Error**: `Error: 1205 - Lock wait timeout exceeded`

**Solution**:
```sql
-- Kill long-running queries
SHOW PROCESSLIST;
KILL [process_id];

-- Check for table locks
SHOW OPEN TABLES WHERE in_use > 0;
```

### Issue: Out of Memory Error
**Error**: `Error: Out of memory`

**Solutions**:
1. Increase MySQL max_connections
2. Optimize large queries
3. Add pagination to queries
4. Use batch processing for large datasets

### Issue: Corruption Error
**Error**: `Got error 134 from storage engine`

**Solution**:
```bash
# Repair table
mysql -u root -p -e "REPAIR TABLE table_name"

# Or use MySQL utilities
myisamchk -r database_name.MYI
```

### Issue: Slow Queries
**Error**: Queries taking too long

**Solutions**:
1. Add indexes to frequently queried columns
2. Use EXPLAIN to analyze queries
3. Optimize queries with LIMIT
4. Consider query caching

---

## Deployment Issues

### Issue: Application Works Locally but Not on Server
**Causes & Solutions**:
```bash
# 1. Environment variables not set
# Set all required variables on server

# 2. Port blocked by firewall
# Allow ports 8080, 3000, 3306

# 3. Database connection string different
# Update for server environment

# 4. Missing dependencies
# Run npm install and mvn install on server

# 5. Permissions issues
# Check file permissions: chmod 755
```

### Issue: SSL Certificate Error
**Error**: `SSL_ERROR_RX_RECORD_TOO_LONG` or similar

**Solutions**:
1. Verify SSL certificate is valid
2. Use HTTPS only
3. Update API URL to HTTPS
4. Check certificate chain is complete

### Issue: 404 on Production
**Error**: Static files not found

**Solutions**:
1. Ensure build files are deployed
2. Check web server configuration
3. Verify correct paths in API calls
4. Check CDN cache

---

## Performance Issues

### Issue: Slow Page Load
**Symptoms**: Long loading time, poor response

**Solutions**:
1. Minimize bundle size (webpack analysis)
2. Implement lazy loading
3. Optimize images
4. Use CDN for static files
5. Enable gzip compression
6. Implement caching

### Issue: High Memory Usage
**Symptoms**: Browser crashes, slow performance

**Solutions**:
1. Check for memory leaks in components
2. Use React.memo for large lists
3. Implement virtual scrolling
4. Clean up subscriptions
5. Monitor with DevTools

### Issue: High CPU Usage
**Symptoms**: Fan running, battery drain

**Solutions**:
1. Profile code with DevTools
2. Remove unnecessary re-renders
3. Optimize algorithms
4. Use web workers for heavy tasks
5. Implement debouncing/throttling

---

## Security Issues

### Issue: XSS (Cross-Site Scripting)
**Prevention**:
1. Use React's built-in XSS protection
2. Sanitize user input
3. Use DOMPurify for HTML content
4. Set proper CSP headers

### Issue: CSRF (Cross-Site Request Forgery)
**Prevention**:
1. Use SameSite cookie attribute
2. Validate CSRF tokens
3. Use POST for state-changing operations

### Issue: Sensitive Data Exposed
**Prevention**:
1. Never commit API keys
2. Use .env files
3. Remove sensitive logs
4. Use HTTPS only
5. Implement proper authentication

---

## Quick Checklist

### Before Deployment
- ✅ All environment variables set
- ✅ Database migrated
- ✅ SSL certificates installed
- ✅ CORS properly configured
- ✅ Sensitive data removed from code
- ✅ Logging configured
- ✅ Backups scheduled
- ✅ Monitoring set up
- ✅ Error tracking enabled
- ✅ Performance optimized

### During Deployment
- ✅ Run tests
- ✅ Build production bundles
- ✅ Deploy to staging first
- ✅ Run smoke tests
- ✅ Monitor logs
- ✅ Check all endpoints
- ✅ Verify payments work
- ✅ Test authentication

### After Deployment
- ✅ Monitor performance
- ✅ Check error logs
- ✅ Verify user registration
- ✅ Test critical flows
- ✅ Check database backups
- ✅ Review security logs

---

## Getting Help

1. **Check Logs**
   ```bash
   # Backend
   tail -f target/career-mitra.log
   
   # Frontend
   # Check browser console (F12)
   ```

2. **Enable Debug Mode**
   ```bash
   # Backend
   logging.level.root=DEBUG
   
   # Frontend
   # Add console.log statements
   ```

3. **Search Common Issues**
   - GitHub Issues
   - Stack Overflow
   - Spring Boot docs
   - React docs

4. **Ask for Help**
   - Discord community
   - Email support@careermitra.com
   - GitHub discussions

---

**Last Updated**: May 2024
**Version**: 1.0.0
