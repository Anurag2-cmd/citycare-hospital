# CityCare Hospital Website

A full-stack hospital website with React frontend, Node/Express backend, and Google AI Studio chatbot integration.

## Features

- **Frontend (React + Vite)**: Home, About, Services, Doctors, Appointments, Contact, Login, Register, Patient Portal
- **Backend (Node/Express + MongoDB)**: REST API with authentication, appointments, doctors, AI chatbot
- **AI Chatbot**: Powered by Google Gemini 1.5 Flash via Google AI Studio API
- **Patient Portal**: Secure login, appointment management, medical records, messaging, billing
- **Appointment Booking**: Multi-step wizard with doctor availability

## Project Structure

```
hospital-website/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable components (Layout, ChatBot)
│   │   ├── context/      # React Context (Auth, Chat)
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── utils/        # Utility functions
│   └── ...
└── server/          # Node/Express backend
    ├── server.js         # Main server file
    └── .env              # Environment variables
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google AI Studio API Key

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GOOGLE_AI_API_KEY=your-google-ai-studio-api-key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

3. Get Google AI Studio API Key:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Add it to `.env` as `GOOGLE_AI_API_KEY`

4. Start MongoDB (if local):
```bash
mongod
```

5. Start backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start frontend:
```bash
npm run dev
```

## Running Both

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd hospital-website/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd hospital-website/client
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:5000/api/health` for the API health check.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Doctors
- `GET /api/doctors` - List all doctors (query: `specialization`)
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/:id/availability` - Get available slots for date

### Appointments
- `POST /api/appointments` - Book appointment (auth required)
- `GET /api/appointments` - Get user appointments (auth required)
- `PUT /api/appointments/:id/cancel` - Cancel appointment (auth required)

### Chatbot
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history/:sessionId` - Get chat history

### Services
- `GET /api/services` - Get all hospital services

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios, Lucide React, date-fns, react-hot-toast
- **Backend**: Node.js, Express, MongoDB (native driver), JWT, bcryptjs, Google Generative AI
- **AI**: Google Gemini 1.5 Flash via @google/generative-ai

## Project ID

The Google Cloud project ID for this integration is: `gen-lang-client-0399460992`

## License

MIT