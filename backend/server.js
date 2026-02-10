const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/Admin');
const Blog = require('./models/Blogs'); // Ensure your Schema has header1, header2, and content2
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// --- ADMIN ROUTES ---

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

// POST: Admin adds a new blog 
app.post('/api/blogs', async (req, res) => {
  try {
    // ADDED altText1 and altText2 to the extraction list below
    const { title, imageUrl, altText1, header1, content, imageUrl2, altText2, header2, content2, isFeatured } = req.body;

    const newBlog = new Blog({ 
      title, 
      imageUrl,
      altText1,
      header1,
      content,
      imageUrl2,
      altText2,
      header2,
      content2,
      isFeatured: isFeatured === true || isFeatured === 'true'
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog posted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving blog", error: err.message });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching the blog detail" });
  }
});

app.post('/api/blogs/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Blog.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Deleted from Database" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend Server running on port 3000"));