# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints (except auth endpoints) require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication Endpoints

#### 1. Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT" // or "MENTOR"
}

Response 201:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

#### 3. Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>

Response 200:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "isActive": true
}
```

### Mentor Endpoints

#### 1. Get All Mentors (with filters)
```http
GET /mentors?domain=Tech&minExperience=5&maxPrice=5000

Response 200:
[
  {
    "id": 1,
    "name": "Jane Smith",
    "bio": "Senior Software Engineer...",
    "company": "Google",
    "domain": "Tech",
    "yearsOfExperience": 10,
    "sessionPrice": 2000,
    "skills": ["React", "Node.js"],
    "rating": 4.8,
    "reviewCount": 25
  }
]
```

#### 2. Get Mentor Profile
```http
GET /mentors/{id}

Response 200:
{
  "id": 1,
  "name": "Jane Smith",
  "bio": "Senior Software Engineer",
  "company": "Google",
  "domain": "Tech",
  "yearsOfExperience": 10,
  "sessionPrice": 2000,
  "skills": ["React", "Node.js"],
  "expertise": ["Full Stack", "Architecture"],
  "rating": 4.8,
  "reviewCount": 25
}
```

#### 3. Update Mentor Profile
```http
PUT /mentors/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Updated bio",
  "company": "New Company",
  "domain": "Tech",
  "yearsOfExperience": 11,
  "sessionPrice": 2500,
  "skills": ["React", "Vue", "Angular"],
  "expertise": ["Frontend", "Architecture"]
}

Response 200: Updated mentor object
```

### Booking Endpoints

#### 1. Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "mentorId": 1,
  "sessionDate": "2024-06-15",
  "timeSlot": "14:00-15:00",
  "topic": "React Best Practices",
  "description": "I want to learn about performance optimization"
}

Response 201:
{
  "id": 1,
  "studentId": 5,
  "mentorId": 1,
  "sessionDate": "2024-06-15",
  "timeSlot": "14:00-15:00",
  "topic": "React Best Practices",
  "amount": 2000,
  "status": "PENDING"
}
```

#### 2. Get Available Slots
```http
GET /bookings/available-slots/{mentorId}?date=2024-06-15

Response 200:
["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"]
```

#### 3. Approve Booking (Mentor)
```http
PUT /bookings/{id}/approve
Authorization: Bearer <token>

Response 200: Booking with status "APPROVED"
```

#### 4. Reject Booking (Mentor)
```http
PUT /bookings/{id}/reject
Authorization: Bearer <token>

Response 200: Booking with status "REJECTED"
```

#### 5. Complete Booking
```http
PUT /bookings/{id}/complete
Authorization: Bearer <token>

Response 200: Booking with status "COMPLETED"
```

### Review Endpoints

#### 1. Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": 1,
  "rating": 5,
  "comment": "Great session! Learned a lot about React performance."
}

Response 201:
{
  "id": 1,
  "bookingId": 1,
  "rating": 5,
  "comment": "Great session!",
  "studentName": "John Doe"
}
```

#### 2. Get Mentor Reviews
```http
GET /reviews/mentor/{mentorId}

Response 200:
[
  {
    "id": 1,
    "rating": 5,
    "comment": "Great session!",
    "studentName": "John Doe"
  }
]
```

### Payment Endpoints

#### 1. Create Payment Order
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": 1,
  "amount": 2000
}

Response 201:
{
  "id": 1,
  "bookingId": 1,
  "amount": 2000,
  "razorpayOrderId": "order_1234567890",
  "status": "PENDING"
}
```

#### 2. Verify Payment
```http
POST /payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_1234567890",
  "paymentId": "pay_1234567890",
  "signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}

Response 200:
{
  "message": "Payment verified successfully"
}
```

### Availability Endpoints

#### 1. Get Mentor Availability
```http
GET /availability/{mentorId}

Response 200:
[
  {
    "id": 1,
    "mentorId": 1,
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "18:00"
  }
]
```

#### 2. Add Availability Slot
```http
POST /availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "18:00"
}

Response 201: Availability object
```

#### 3. Delete Availability Slot
```http
DELETE /availability/{id}
Authorization: Bearer <token>

Response 200:
{
  "message": "Availability deleted"
}
```

### Admin Endpoints

#### 1. Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>

Response 200:
{
  "totalUsers": 150,
  "totalMentors": 45,
  "totalSessions": 892,
  "totalRevenue": 1250000
}
```

#### 2. Approve Mentor
```http
PUT /admin/mentors/{id}/approve
Authorization: Bearer <admin-token>

Response 200:
{
  "message": "Mentor approved"
}
```

#### 3. Block User
```http
PUT /admin/users/{id}/block
Authorization: Bearer <admin-token>

Response 200:
{
  "message": "User blocked"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials",
  "status": 401
}
```

### 404 Not Found
```json
{
  "message": "Resource not found",
  "status": 404
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "status": 500
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

List endpoints support pagination:
```http
GET /mentors?page=1&limit=10
```

Query Parameters:
- `page` (default: 0)
- `limit` (default: 10, max: 100)
