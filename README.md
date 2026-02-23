# BloodConnect - Blood Donation Platform

> A web application connecting blood donors and seekers with **JWT-based authentication** and secure donor management.

<<<<<<< HEAD
## Live Link: 
https://blood-connect-jwdg.vercel.app/ 

## Overview
BloodConnect is a full-stack blood donation management system that connects blood donors with those in need. The platform allows donors to register, search for available donors, and connect through a centralized database.
=======
## 🚀 Features

✅ **User Authentication**
- Secure JWT-based authentication  
- User registration & login with email validation
- Password hashing with bcrypt
- 7-day token expiration
>>>>>>> 77ec9c9 (add authentication)

✅ **Protected Routes**
- Only authenticated users can register as donors or search for donors
- Automatic redirect to login for unauthenticated users
- Authorization header validation on all protected endpoints

✅ **Donor Management**
- Register as a blood donor with personal & medical info
- Search donors by blood group and city
- View donor contact information and notes

✅ **Modern UI**
- Responsive navbar with auth state display
- Login/Signup pages
- Dynamic navbar showing user info and logout option
- Toast notifications for user feedback

## 🔐 Authentication System

**All users must login/signup before:**
- Registering as a donor
- Searching for donors

**JWT Tokens:**
- Generated on signup/login
- Stored in browser localStorage
- Sent in Authorization header: `Bearer {token}`
- Expires in 7 days

## 📊 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- Bcrypt for password hashing
- CORS for cross-origin requests

**Frontend:**
- HTML5, CSS3, Bootstrap Icons
- Vanilla JavaScript (ES6+)
- localStorage for JWT storage

### Tools & Libraries
- **dotenv** — Environment variable management
- **CORS** — Cross-Origin Resource Sharing
- **Nodemon** — Development auto-reload

## Project Structure

```
bloodconnect-backend/
├── src/
│   ├── app.js                 # Express app entry point
│   ├── config/
│   │   └── database.js        # MongoDB connection configuration
│   ├── controllers/
│   │   └── index.js           # Route handlers for API endpoints
│   ├── models/
│   │   ├── donor.js           # Donor database schema
│   │   └── registration.js    # Registration related models
│   └── routes/
│       └── index.js           # API routes
├── public/
│   ├── index.html             # Home page
│   ├── about.html             # About page
│   ├── register.html          # Donor registration form
│   ├── search.html            # Search donors page
│   ├── contact.html           # Contact page
│   ├── style.css              # Styling
│   ├── script.js              # Frontend JavaScript
│   └── assets/                # Images and static files
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bloodconnect-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment configuration**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bloodconnect
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

### POST `/api/register`
Register a new blood donor.

**Request Body:**
```json
{
  "name": "Sahil Shinde",
  "age": 28,
  "gender": "Male",
  "bloodGroup": "O+",
  "city": "India",
  "contact": "+1234567890",
  "notes": "Available for donation"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Sahil Shinde",
  "age": 28,
  "gender": "Male",
  "bloodGroup": "O+",
  "city": "India",
  "contact": "+1234567890",
  "notes": "Available for donation"
}
```

### GET `/api/search`
Search for blood donors.

**Query Parameters:**
- `bloodGroup` — (optional) Filter by blood group (e.g., "O+", "A-")
- `city` — (optional) Filter by city

**Example:**
```
GET /api/search?bloodGroup=O+&city=New%20York
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sahil Shinde",
    "age": 28,
    "gender": "Male",
    "bloodGroup": "O+",
    "city": "India",
    "contact": "+1234567890",
    "notes": "Available for donation"
  }
]
```

## Pages

- **Home** (`index.html`) — Welcome page with project information
- **About** (`about.html`) — Information about the BloodConnect initiative
- **Register** (`register.html`) — Form to register as a blood donor
- **Search** (`search.html`) — Search and find available donors
- **Contact** (`contact.html`) — Contact information and support

## Database Schema

### Donor Model
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Donor's full name |
| age | Number | Yes | Donor's age |
| gender | String | Yes | Donor's gender |
| bloodGroup | String | Yes | Blood group (e.g., O+, A-, B+) |
| city | String | Yes | Donor's city/location |
| contact | String | Yes | Contact phone number |
| notes | String | No | Additional notes or availability |

## Development

## Project Structure

```
bloodconnect-backend/
├── public/                 # Frontend files
│   ├── index.html         # Home page
│   ├── login.html         # Login page (NEW)
│   ├── signup.html        # Signup page (NEW)
│   ├── register.html      # Donor registration (protected)
│   ├── search.html        # Search donors (protected)
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── script.js          # Frontend JS (auth, forms, API)
│   ├── style.css          # CSS styles
│   └── assets/            # Images & resources
│
├── src/
│   ├── app.js             # Express server setup
│   ├── config/
│   │   └── database.js    # MongoDB connection
│   ├── models/
│   │   ├── user.js        # User schema (NEW - auth)
│   │   ├── donor.js       # Donor schema
│   │   └── registration.js# Donor registration schema
│   ├── controllers/
│   │   ├── auth.js        # Auth logic (NEW)
│   │   └── index.js       # Donor logic
│   ├── middleware/
│   │   └── auth.js        # JWT middleware (NEW)
│   └── routes/
│       ├── authRoutes.js  # Auth endpoints (NEW)
│       └── index.js       # Donor endpoints (protected)
│
├── .env.example           # Environment template (NEW)
├── .env                   # Environment variables (create from example)
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

Installs: express, mongoose, jsonwebtoken, bcrypt, cors, dotenv, nodemon

### Step 2: Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodconnect
JWT_SECRET=your_random_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

**MongoDB Setup:**
- **Local:** Install MongoDB, ensure running on `mongodb://localhost:27017`
- **Cloud:** Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### Step 3: Start Server

**Development** (auto-restart):

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Open `http://localhost:5000`

---

## 🔐 API Endpoints

### 🔐 Authentication Routes

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | ❌ | `{name, email, password}` | `{token, user}` |
| POST | `/api/auth/login` | ❌ | `{email, password}` | `{token, user}` |
| POST | `/api/auth/logout` | ❌ | - | `{message}` |
| GET | `/api/auth/me` | ✅ | - | `{user}` |

### 🩸 Donor Routes (Protected)

| Method | Endpoint | Auth | Query | Body | Response |
|--------|----------|------|-------|------|----------|
| POST | `/api/donor/register` | ✅ | - | `{name, age, gender, bloodGroup, city, contact, notes}` | `{message, registration}` |
| GET | `/api/donor/search` | ✅ | `bloodGroup, city` | - | `[{donors}]` |

**Example: Register as Donor**

```javascript
const token = localStorage.getItem('token');

fetch('/api/donor/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'John Doe',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+',
    city: 'Mumbai',
    contact: '+919876543210',
    notes: 'Available weekends'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

**Example: Search Donors**

```javascript
const token = localStorage.getItem('token');

fetch('/api/donor/search?bloodGroup=O%2B&city=Mumbai', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(donors => console.log(donors))
```

---

## 🚀 Usage Flow

### 1️⃣ Signup
- Navigate to `/signup.html`
- Enter name, email, password
- POST to `/api/auth/register`
- Token saved → redirect to home

### 2️⃣ Login
- Navigate to `/login.html`
- Enter email, password
- POST to `/api/auth/login`
- Token saved → redirect to home

### 3️⃣ Register as Donor
- Click "Register as Donor" (navbar)
- Must be logged in (protected page)
- Fill donor details
- POST to `/api/donor/register` with JWT in header

### 4️⃣ Search Donors
- Click "Search Donors" (navbar)
- Must be logged in (protected page)
- Filter by blood group/city
- GET from `/api/donor/search` with JWT in header

### 5️⃣ Logout
- Click "Logout" (navbar)
- Token cleared from localStorage
- Redirected to home
- Can't access protected pages until re-login

---

## 🛡️ Security Features

✅ **Password Hashing** — bcrypt with 10 salt rounds
✅ **JWT Tokens** — 7-day expiration
✅ **Middleware Protection** — Authorization header validation
✅ **Email Uniqueness** — Prevents duplicate accounts
✅ **Input Validation** — Server-side checks
✅ **CORS** — Configured for frontend access

---

## 🧪 Testing

### Test Signup/Login
```bash
# 1. Start server
npm run dev

# 2. Open browser to http://localhost:5000
# 3. Click Signup → create account
# 4. Check localStorage for token:
#    - Open DevTools (F12)
#    - Application → LocalStorage → token
```

### Test Protected Routes
```javascript
// In browser console

// Get stored token
const token = localStorage.getItem('token');

// Test /api/auth/me
fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));

// Test search without token (should fail)
fetch('/api/donor/search').then(r => console.log(r.status)); // 401
```

---

## 📝 Frontend JavaScript Utilities

**Auth Functions (in `script.js`):**

```javascript
getToken()                    // Get JWT from localStorage
getUser()                     // Get user object
getAuthHeaders()              // Get {Authorization: 'Bearer token'}
isAuthenticated()             // Check if logged in
handleLogout()                // Logout user
updateAuthUI()                // Update navbar auth state

// Notifications
showSuccess(title, msg)       // Green toast
showError(title, msg)         // Red toast
showWarning(title, msg)       // Yellow toast
showInfo(title, msg)          // Blue toast
```

---

## 🐛 Error Handling

Server returns appropriate HTTP status codes:

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad request | Missing fields |
| 401 | Unauthorized | Invalid token, wrong password |
| 409 | Conflict | Email already exists |
| 500 | Server error | Database connection failed |

**Error Response Format:**

```json
{
  "message": "Email already in use"
}
```

---

## 🚀 Deployment

### Render / Railway / Heroku

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables:
   - `MONGODB_URI` — Cloud MongoDB connection string
   - `JWT_SECRET` — Strong random string
   - `PORT` — 5000
   - `NODE_ENV` — production

### Generate Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check `MONGODB_URI` in `.env` |
| 401 Unauthorized on protected routes | Token expired or invalid → re-login |
| CORS error in browser | Check `/api` routes send correct headers |
| Token not persisting | Check localStorage in DevTools |
| ""Cannot POST /api/donor/register"" | Check JWT token sent in Authorization header |

---

## 📚 What's New (Authentication Update)

✨ **NEW FILES:**
- `src/models/user.js` — User authentication model
- `src/controllers/auth.js` — Auth business logic
- `src/middleware/auth.js` — JWT verification
- `src/routes/authRoutes.js` — Auth endpoints
- `public/login.html` — Login page
- `public/signup.html` — Signup page
- `.env.example` — Environment template

✨ **UPDATED FILES:**
- `src/app.js` — Added auth routes, JWT middleware
- `src/routes/index.js` — Protected donor routes with auth
- `public/script.js` — Auth UI, JWT headers, protected pages
- `package.json` — Added jsonwebtoken, bcrypt

✨ **PROTECTED PAGES:**
- `/register.html` — Requires login
- `/search.html` — Requires login

---

## 📄 License

MIT

---

**Built with ❤️ for saving lives** 🩸
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/bloodconnect |
| NODE_ENV | Environment (development/production) | development |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License — see the [package.json](package.json) file for details.

## Support

For issues, questions, or suggestions, please contact us through the Contact page or open an issue in the repository.

---

**BloodConnect** — Because every drop of blood can save a life. 🩸
