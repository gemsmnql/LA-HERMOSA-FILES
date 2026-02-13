const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: { type: String, default: 'Admin' }, // Added to ensure custom names are saved
  imageUrl: String,
  altText: String,    
  header1: String,
  content: String,  
  imageUrl2: String,
  altText2: String,   
  header2: String,
  content2: String,
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
