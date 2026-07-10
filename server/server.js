import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY || '' });

let db;
let usersCollection;
let appointmentsCollection;
let doctorsCollection;
let chatHistoryCollection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('hospital');
    usersCollection = db.collection('users');
    appointmentsCollection = db.collection('appointments');
    doctorsCollection = db.collection('doctors');
    chatHistoryCollection = db.collection('chat_history');
    
    await seedDoctors();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function seedDoctors() {
  const count = await doctorsCollection.countDocuments();
  if (count === 0) {
    const doctors = [
      {
        _id: new ObjectId(),
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        experience: '15 years',
        education: 'MD, Cardiology - Johns Hopkins University',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        rating: 4.9,
        reviews: 127,
        about: 'Board-certified cardiologist with expertise in interventional cardiology and heart failure management.',
        consultationFee: 150
      },
      {
        _id: new ObjectId(),
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        experience: '12 years',
        education: 'MD, Neurology - Stanford University',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
        rating: 4.8,
        reviews: 98,
        about: 'Specializes in neurodegenerative disorders, stroke management, and epilepsy treatment.',
        consultationFee: 180
      },
      {
        _id: new ObjectId(),
        name: 'Dr. Emily Rodriguez',
        specialization: 'Pediatrics',
        experience: '10 years',
        education: 'MD, Pediatrics - Harvard Medical School',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
        rating: 4.9,
        reviews: 156,
        about: 'Pediatric specialist focusing on child development, immunizations, and adolescent care.',
        consultationFee: 120
      },
      {
        _id: new ObjectId(),
        name: 'Dr. James Wilson',
        specialization: 'Orthopedics',
        experience: '18 years',
        education: 'MD, Orthopedic Surgery - Mayo Clinic',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        rating: 4.7,
        reviews: 89,
        about: 'Expert in joint replacement, sports medicine, and minimally invasive orthopedic surgery.',
        consultationFee: 200
      },
      {
        _id: new ObjectId(),
        name: 'Dr. Priya Sharma',
        specialization: 'Dermatology',
        experience: '8 years',
        education: 'MD, Dermatology - UCSF',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        rating: 4.8,
        reviews: 112,
        about: 'Specializes in medical dermatology, cosmetic procedures, and skin cancer screening.',
        consultationFee: 140
      },
      {
        _id: new ObjectId(),
        name: 'Dr. Robert Kim',
        specialization: 'Oncology',
        experience: '20 years',
        education: 'MD, Oncology - MD Anderson Cancer Center',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['08:00', '09:00', '10:00', '13:00', '14:00'],
        rating: 4.9,
        reviews: 203,
        about: 'Leading oncologist specializing in breast cancer, lung cancer, and immunotherapy treatments.',
        consultationFee: 250
      }
    ];
    await doctorsCollection.insertMany(doctors);
    console.log('Doctors seeded successfully');
  }
}

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hospital-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hospital-secret-key');
      req.user = decoded;
    } catch (error) {
    }
  }
  next();
};

app.post('/api/auth/register', requireDB, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: new ObjectId(),
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: 'patient',
      createdAt: new Date()
    };
    
    await usersCollection.insertOne(user);
    
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'hospital-secret-key',
      { expiresIn: '7d' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', requireDB, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'hospital-secret-key',
      { expiresIn: '7d' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', optionalAuth, requireDB, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, phone: user.phone }
  });
});

function requireDB(req, res, next) {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }
  next();
}

app.get('/api/doctors', requireDB, async (req, res) => {
  try {
    const { specialization } = req.query;
    const query = specialization ? { specialization } : {};
    const doctors = await doctorsCollection.find(query).toArray();
    res.json(doctors.map(d => ({ ...d, id: d._id.toString() })));
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

app.post('/api/doctors', requireDB, async (req, res) => {
  try {
    const { name, specialization, experience, education, image, availableDays, availableSlots, rating, reviews, about, consultationFee } = req.body;
    
    if (!name || !specialization) {
      return res.status(400).json({ error: 'Name and specialization are required' });
    }
    
    const doctor = {
      _id: new ObjectId(),
      name,
      specialization,
      experience: experience || '',
      education: education || '',
      image: image || '',
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: availableSlots || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      rating: rating || 4.5,
      reviews: reviews || 0,
      about: about || '',
      consultationFee: consultationFee || 100
    };
    
    await doctorsCollection.insertOne(doctor);
    res.status(201).json({ ...doctor, id: doctor._id.toString() });
  } catch (error) {
    console.error('Add doctor error:', error);
    res.status(500).json({ error: 'Failed to add doctor' });
  }
});

app.get('/api/doctors/:id', requireDB, async (req, res) => {
  try {
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ ...doctor, id: doctor._id.toString() });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

app.get('/api/doctors/:id/availability', requireDB, async (req, res) => {
  try {
    const { date } = req.query;
    let doctorId;
    try {
      doctorId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }
    
    const doctor = await doctorsCollection.findOne({ _id: doctorId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!doctor.availableDays.includes(dayName)) {
      return res.json([]);
    }
    
    const bookedSlots = await appointmentsCollection.find({
      doctorId,
      date: appointmentDate,
      status: { $ne: 'cancelled' }
    }).toArray();
    
    const bookedTimes = bookedSlots.map(a => a.timeSlot);
    const availableSlots = doctor.availableSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json(availableSlots);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

app.post('/api/appointments', authenticateToken, requireDB, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, type } = req.body;
    
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Doctor, date, and time slot are required' });
    }
    
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(doctorId) });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!doctor.availableDays.includes(dayName)) {
      return res.status(400).json({ error: 'Doctor is not available on this day' });
    }
    
    if (!doctor.availableSlots.includes(timeSlot)) {
      return res.status(400).json({ error: 'Selected time slot is not available' });
    }
    
    const existingAppointment = await appointmentsCollection.findOne({
      doctorId: new ObjectId(doctorId),
      date: appointmentDate,
      timeSlot,
      status: { $ne: 'cancelled' }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }
    
    const appointment = {
      _id: new ObjectId(),
      patientId: new ObjectId(req.user.userId),
      doctorId: new ObjectId(doctorId),
      date: appointmentDate,
      timeSlot,
      reason: reason || '',
      type: type || 'consultation',
      status: 'confirmed',
      createdAt: new Date()
    };
    
    await appointmentsCollection.insertOne(appointment);
    
    res.status(201).json({
      appointment: { ...appointment, id: appointment._id.toString(), doctorId: appointment.doctorId.toString(), patientId: appointment.patientId.toString() }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.get('/api/appointments', authenticateToken, requireDB, async (req, res) => {
  try {
    const appointments = await appointmentsCollection.find({ 
      patientId: new ObjectId(req.user.userId) 
    }).sort({ date: -1 }).toArray();
    
    const appointmentsWithDoctors = await Promise.all(
      appointments.map(async (apt) => {
        const doctor = await doctorsCollection.findOne({ _id: apt.doctorId });
        return {
          ...apt,
          id: apt._id.toString(),
          doctorId: apt.doctorId.toString(),
          patientId: apt.patientId.toString(),
          doctor: doctor ? { ...doctor, id: doctor._id.toString() } : null
        };
      })
    );
    
    res.json(appointmentsWithDoctors);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.put('/api/appointments/:id/cancel', authenticateToken, requireDB, async (req, res) => {
  try {
    const appointment = await appointmentsCollection.findOne({ 
      _id: new ObjectId(req.params.id),
      patientId: new ObjectId(req.user.userId)
    });
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    await appointmentsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'cancelled' } }
    );
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

app.post('/api/chat', optionalAuth, requireDB, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const chatSessionId = sessionId || uuidv4();
    
    const history = await chatHistoryCollection.find({ sessionId: chatSessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    const context = history.reverse().map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));
    
    const systemPrompt = `You are MedAssist, an AI health assistant for CityCare Hospital. 
    Provide helpful, accurate, and safe health information. 
    Always include a disclaimer that you are an AI assistant and not a substitute for professional medical advice.
    Be empathetic and professional. If symptoms sound serious, recommend seeing a doctor immediately.
    You can help with: general health questions, appointment booking guidance, doctor information, hospital services, and basic medical information.`;
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I am MedAssist, your AI health assistant for CityCare Hospital. I provide helpful health information and guidance, but I always remind users that I am an AI assistant and not a substitute for professional medical advice. How can I help you today?' }] },
        ...context
      ]
    });
    
    const result = await chat.sendMessage({ message });
    const responseText = result.text;
    
    await chatHistoryCollection.insertMany([
      { sessionId: chatSessionId, role: 'user', content: message, timestamp: new Date() },
      { sessionId: chatSessionId, role: 'model', content: responseText, timestamp: new Date() }
    ]);
    
    if (req.user) {
      await chatHistoryCollection.updateMany(
        { sessionId: chatSessionId },
        { $set: { userId: new ObjectId(req.user.userId) } }
      );
    }
    
    res.json({ response: responseText, sessionId: chatSessionId });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.get('/api/chat/history/:sessionId', optionalAuth, requireDB, async (req, res) => {
  try {
    const history = await chatHistoryCollection.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: 1 })
      .toArray();
    res.json(history);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 1,
      name: 'Emergency Care',
      description: '24/7 emergency department with trauma center',
      icon: '🚑',
      details: ['Level 1 Trauma Center', 'Pediatric Emergency', 'Cardiac Emergency', 'Stroke Center']
    },
    {
      id: 2,
      name: 'Cardiology',
      description: 'Comprehensive heart and vascular care',
      icon: '❤️',
      details: ['Interventional Cardiology', 'Heart Failure Clinic', 'Arrhythmia Management', 'Preventive Cardiology']
    },
    {
      id: 3,
      name: 'Neurology',
      description: 'Advanced neurological care and neurosurgery',
      icon: '🧠',
      details: ['Stroke Center', 'Epilepsy Monitoring', 'Movement Disorders', 'Neuro-oncology']
    },
    {
      id: 4,
      name: 'Orthopedics',
      description: 'Bone, joint, and muscle care with sports medicine',
      icon: '🦴',
      details: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Hand & Upper Extremity']
    },
    {
      id: 5,
      name: 'Pediatrics',
      description: 'Complete child healthcare from birth to adolescence',
      icon: '👶',
      details: ['Well-child Visits', 'Immunizations', 'Pediatric Specialties', 'Adolescent Care']
    },
    {
      id: 6,
      name: 'Oncology',
      description: 'Comprehensive cancer care and treatment',
      icon: '🎗️',
      details: ['Medical Oncology', 'Radiation Therapy', 'Surgical Oncology', 'Clinical Trials']
    }
  ];
  res.json(services);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch(err => {
    console.error('DB failed, server starting without DB:', err.message);
    startServer();
  });

export default app;