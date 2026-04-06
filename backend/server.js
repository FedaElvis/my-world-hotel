const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary multer storage (files go directly to Cloudinary, never saved locally)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'myworld-hotel',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const upload = multer({ storage });

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Upload Endpoint - now returns permanent Cloudinary URLs
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  try {
    const fileUrls = req.files.map(file => file.path);
    res.status(200).json({ urls: fileUrls });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files' });
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myworld-hotel')
    .then(async () => {
        console.log('MongoDB Connected');
        
        // Seed default admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@myworldhotel.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
        
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const admin = new User({
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Default admin user created');
        }
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
