const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {

    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true

  },
  price: {
    type: Number,
    required: true,
    min: 0
  },

  image: {
    type: String, // We'll store the path to the image
    required: true
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
      min: 0
    },
    breadth: {
      type: Number,
      required: true,
      min: 0
    },
    height: {
      type: Number,
      required: true,
      min: 0
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['Sofa', 'Dining Table', 'TV Cabinets', 'Wardrobe', 'Tables'],
    default: 'Tables'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 