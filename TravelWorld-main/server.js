// const express = require('express');
// const history = require('connect-history-api-fallback');
// const path = require('path');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // for password hashing

// const app = express();

// // Middleware
// app.use(express.json()); // for parsing application/json
// app.use(express.static(path.join(__dirname, 'build')));
// app.use(history());

// // MongoDB connection
// const uri = "mongodb+srv://giridharak2301:Admin@cluster0.imngn72.mongodb.net/Travel_with_us?retryWrites=true&w=majority&appName=Cluster0";

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// // Schema for Register collection
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { collection: "Register" }); // Explicitly use "Register" collection

// const User = mongoose.model("Register", userSchema);

// // ========== AUTH ROUTES ==========

// // ✅ Register route
// app.post("/auth/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists with this email" });
//     }

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully", user: { username, email } });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Login route
// app.post("/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Compare hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Login success
//     res.status(200).json({
//       message: "Login successful",
//       user: { username: user.username, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Get all registered users (for testing)
// app.get("/auth/users", async (req, res) => {
//   try {
//     const users = await User.find({}, "-password"); // exclude password
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Serve React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('🚀 Server is running on port 3000');
// });







const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const validator = require('validator');
const winston = require('winston');
require('dotenv').config();

const app = express();

// Security logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
    new winston.transports.Console()
  ]
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: { message: 'Too many authentication attempts, please try again later.' },
  skipSuccessfulRequests: true
});

app.use(generalLimiter);

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.static(path.join(__dirname, 'build')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path.includes('auth')) {
    console.log('Request body (sanitized):', {
      ...req.body,
      password: req.body.password ? '[HIDDEN]' : undefined
    });
  }
  next();
});

// MongoDB connection with better error handling
const uri = process.env.MONGODB_URI || "mongodb+srv://giridharak2301:Admin@cluster0.imngn72.mongodb.net/Travel_with_us?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  securityLogger.info('Database connection established');
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  securityLogger.error('Database connection failed', { error: err.message });
});

// Enhanced user schema with validation
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username must be less than 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, { 
  collection: "Register",
  timestamps: true
});

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

const User = mongoose.model("Register", userSchema);

// Helper functions



// // models/Contact.js
// const mongoose = require("mongoose");
// const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: "ContactMessages" });

const Contact = mongoose.model("Contact", contactSchema);


// const mongoose = require("mongoose");
// const validator = require("validator");

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: "NewsletterSubscribers" });
const Newsletter = mongoose.model("Newsletter", newsletterSchema);



// ✅ Subscribe to newsletter
app.post("/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("news subscribe",)

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "This email is already subscribed!" });
    }

    // Save new subscriber
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ message: "Failed to subscribe. Please try again later." });
  }
});

// ✅ (Optional) Admin route to fetch subscribers
app.get("/newsletter", async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching subscribers" });
  }
});

// ✅ Contact form submission
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    // Log event
    securityLogger.info("New contact form submitted", {
      name,
      email,
      phone
    });

    res.status(201).json({ message: "Form data submitted successfully!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Failed to submit form data. Please try again later." });
  }
});

app.post("/send-email", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_0lxdk3i",   // ✅ Your EmailJS Service ID
        template_id: "template_3bhyiyn", // ✅ Your Template ID
        user_id: "GU9DVc7hBsTajjioN",       // ✅ Must be public key
        template_params: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          message: req.body.message,
        },
      }),
    });

    const data = await response.text(); // EmailJS sometimes returns text not JSON
    console.log("EmailJS response:", data);

    if (response.ok) {
      res.status(200).json({ success: true, message: "Email sent successfully!" });
    } else {
      res.status(500).json({ success: false, error: data });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ (Optional) Admin route to fetch contact messages
app.get("/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact messages" });
  }
});






const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-fallback-secret-change-this',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  const errors = [];
  if (password.length < minLength) errors.push('Password must be at least 6 characters long');
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumbers) errors.push('Password must contain at least one number');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

// ========== AUTH ROUTES ==========

// ✅ Enhanced Register route
app.post("/auth/register", authLimiter, async (req, res) => {
  try {
    console.log("Registration attempt received");
    
    let { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      securityLogger.warn('Registration attempt with missing fields', { 
        ip: req.ip, 
        userAgent: req.get('User-Agent'),
        hasUsername: !!username,
        hasEmail: !!email,
        hasPassword: !!password
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Sanitize inputs
    username = sanitizeInput(username);
    email = sanitizeInput(email);

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({ 
        message: "Username must be 3-30 characters long and contain only letters, numbers, and underscores" 
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "Password requirements not met", 
        errors: passwordValidation.errors 
      });
    }

    console.log("Validation passed, checking for existing users");

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email }, { username: username }] 
    });
    
    if (existingUser) {
      const conflictField = existingUser.email === email ? 'email' : 'username';
      securityLogger.warn('Registration attempt with existing credentials', { 
        ip: req.ip, 
        conflictField,
        attemptedEmail: email,
        attemptedUsername: username
      });
      return res.status(400).json({ 
        message: `User already exists with this ${conflictField}` 
      });
    }

    console.log("No existing user found, proceeding with registration");

    // Hash password with higher salt rounds for better security
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Password hashed, creating user");

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser._id);

    // Generate token
    const token = generateToken(savedUser._id);

    // Log successful registration
    securityLogger.info('User registered successfully', {
      userId: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      ip: req.ip
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { 
        id: savedUser._id,
        username: savedUser.username, 
        email: savedUser.email 
      },
      token
    });

  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors 
      });
    }

    // Handle duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      securityLogger.warn('Duplicate key error during registration', { 
        field, 
        ip: req.ip 
      });
      return res.status(400).json({ 
        message: `User with this ${field} already exists` 
      });
    }

    securityLogger.error('Registration error', { 
      error: err.message, 
      stack: err.stack,
      ip: req.ip 
    });
    
    res.status(500).json({ 
      message: "Internal server error. Please try again later." 
    });
  }
});

// ✅ Enhanced Login route
app.post("/auth/login", authLimiter, async (req, res) => {
  try {
    let { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Sanitize email
    email = sanitizeInput(email);

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      securityLogger.warn('Login attempt with non-existent email', { 
        email, 
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if account is locked
    if (user.isLocked) {
      securityLogger.warn('Login attempt on locked account', { 
        userId: user._id, 
        ip: req.ip 
      });
      return res.status(423).json({ message: "Account is temporarily locked due to too many failed attempts" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + (30 * 60 * 1000); // Lock for 30 minutes
        securityLogger.warn('Account locked due to failed attempts', { 
          userId: user._id, 
          attempts: user.loginAttempts,
          ip: req.ip 
        });
      }
      
      await user.save();
      
      securityLogger.warn('Failed login attempt', { 
        userId: user._id, 
        attempts: user.loginAttempts,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Log successful login
    securityLogger.info('User logged in successfully', {
      userId: user._id,
      username: user.username,
      ip: req.ip
    });

    // Login success
    res.status(200).json({
      message: "Login successful",
      user: { 
        id: user._id,
        username: user.username, 
        email: user.email,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    securityLogger.error('Login error', { 
      error: err.message, 
      ip: req.ip 
    });
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// ✅ Get all registered users (for testing - remove in production)
app.get("/auth/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password -loginAttempts -lockUntil").sort({ createdAt: -1 });
    res.json({
      count: users.length,
      users
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Token verification middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-change-this');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    securityLogger.warn('Invalid token attempt', { 
      token: token.substring(0, 20) + '...', 
      ip: req.ip 
    });
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Protected route example





app.get("/auth/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user
  });
});

// ✅ Logout route
app.post("/auth/logout", authenticateToken, (req, res) => {
  securityLogger.info('User logged out', { 
    userId: req.user._id, 
    ip: req.ip 
  });
  res.json({ message: "Logged out successfully" });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  securityLogger.error('Unhandled error', { 
    error: error.message, 
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip 
  });
  
  res.status(500).json({ 
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Serve React app (keep this before the fallback)
app.use(history());
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 404 handler for API routes that don't exist
app.use('/auth/*', (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  securityLogger.info('Server started', { port: PORT });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});