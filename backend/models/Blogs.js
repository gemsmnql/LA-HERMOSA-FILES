const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  altText: String,    // Binding for the first image
  header1: String,
  content: String,   
  imageUrl2: String,
  altText2: String,   // Binding for the second image
  header2: String,
  content2: String,
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);