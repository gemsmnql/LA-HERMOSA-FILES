const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/Admin');
const Blog = require('./models/Blogs'); 
require('dotenv').config();

const app = express();

// --- FIXED CORS: Allows your live website to talk to this backend ---
app.use(cors({
  origin: [
    'https://lahermosa.shop',
    'https://www.lahermosa.shop',
    'http://localhost:4200'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// --- NEW: Verification Route (to fix the "Cannot GET /" screen) ---
app.get('/', (req, res) => {
  res.send('Backend is running successfully! API is live.');
});

// --- ADMIN LOGIN ---
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '2h' });
    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// --- CREATE BLOG ---
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, imageUrl, altText, header1, content, imageUrl2, altText2, header2, content2, isFeatured } = req.body;
    const newBlog = new Blog({ 
      title, imageUrl, altText, header1, content, 
      imageUrl2, altText2, header2, content2, 
      isFeatured: isFeatured === true || isFeatured === 'true'
    });
    await newBlog.save();
    res.status(201).json({ message: "Blog posted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving blog", error: err.message });
  }
});

// --- GET ALL BLOGS ---
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// --- GET SINGLE BLOG DETAIL ---
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching the blog detail" });
  }
});

// --- DELETE BLOG ---
app.post('/api/blogs/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.json({ message: "Deleted from Database" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FIXED PORT: Essential for Render Deployment ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT}`);
});
