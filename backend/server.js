const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/admin');
const Blog = require('./models/Blogs');
require('dotenv').config();

const app = express();

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
    const { title, author, imageUrl, altText, header1, content, imageUrl2, altText2, header2, content2, isFeatured } = req.body;
    const newBlog = new Blog({
      title,
      author, 
      imageUrl,
      altText,
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

// --- SITEMAP GENERATION WITH LASTMOD ---
app.get('/sitemap.xml', async (req, res) => {
    try {
      // Fetch IDs and creation dates for dynamic links
      const blogs = await Blog.find({}, '_id createdAt'); 
      const today = new Date().toISOString().split('T')[0];
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
      
      // 1. Static Pages
      const staticPages = [
        { url: '', priority: '1.0' },
        { url: 'shop', priority: '0.8' },
        { url: 'blog', priority: '0.8' },
        { url: 'contact', priority: '0.5' },
        { url: 'features', priority: '0.5' }
      ];

      staticPages.forEach(page => {
        xml += `
          <url>
            <loc>https://lahermosa.shop/${page.url}</loc>
            <lastmod>${today}</lastmod>
            <priority>${page.priority}</priority>
          </url>`;
      });
  
      // 2. Dynamic Blog Detail Pages
      blogs.forEach(blog => {
        const blogDate = blog.createdAt ? new Date(blog.createdAt).toISOString().split('T')[0] : today;
        xml += `
          <url>
            <loc>https://lahermosa.shop/blog-detail/${blog._id}</loc>
            <lastmod>${blogDate}</lastmod>
            <priority>0.7</priority>
          </url>`;
      });
  
      xml += `</urlset>`;
  
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      res.status(500).send("Error generating sitemap");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT}`);
});
