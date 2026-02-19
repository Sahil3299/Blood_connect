# BloodConnect

**Connect. Donate. Save.** — A modern web application for managing blood donor registrations and facilitating blood donations.

## Overview
## Live Link: 
https://blood-connect-jwdg.vercel.app/ 
BloodConnect is a full-stack blood donation management system that connects blood donors with those in need. The platform allows donors to register, search for available donors, and connect through a centralized database.

## Features

- 🩸 **Donor Registration** — Register as a blood donor with your details and blood group
- 🔍 **Search Functionality** — Search for available donors by blood group and location
- 📱 **User-Friendly Interface** — Clean and intuitive web interface
- 📊 **Donor Database** — MongoDB-backed database to store donor information
- 🔒 **CORS Enabled** — Secure cross-origin requests
- ⚡ **RESTful API** — Easy-to-use API endpoints

## Tech Stack

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling

### Frontend
- **HTML5** — Structure
- **CSS3** — Styling
- **JavaScript (Vanilla)** — Interactive functionality

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

### Running in Development Mode
```bash
npm run dev
```
Uses Nodemon for automatic server reload on file changes.

### Running Tests
```bash
npm test
```

## Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Default |
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
