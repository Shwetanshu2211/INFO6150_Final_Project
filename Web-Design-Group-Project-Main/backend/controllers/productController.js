const Product = require('../models/Product');
const path = require('path');


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort options
    let sortOptions = {};
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      sortOptions[sortField] = sort.startsWith('-') ? -1 : 1;
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    console.log('Raw request body:', req.body);
    console.log('Request file:', req.file);

    // Parse dimensions from string to object if it's a string
    let dimensions;
    try {
      console.log('Raw dimensions data:', req.body.dimensions);
      dimensions = req.body.dimensions;
      if (typeof dimensions === 'string') {
        dimensions = JSON.parse(dimensions);
      }
      console.log('Parsed dimensions:', dimensions);
    } catch (error) {
      console.error('Error parsing dimensions:', error);
      return res.status(400).json({
        message: 'Invalid dimensions format',
        error: error.message,
        receivedData: req.body.dimensions
      });
    }

    // Extract and validate all fields
    const { title, description, price, category } = req.body;
    console.log('Extracted fields:', { title, description, price, category });

    // Validate all required fields are present
    if (!title || !description || !price || !dimensions || !category) {
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!description) missingFields.push('description');
      if (!price) missingFields.push('price');
      if (!dimensions) missingFields.push('dimensions');
      if (!category) missingFields.push('category');

      console.log('Missing fields:', missingFields);
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
        received: {
          title,
          description,
          price,
          dimensions,
          category
        }
      });
    }

    // Validate price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        message: 'Invalid price value. Price must be a positive number.',
        received: price
      });
    }

    // Validate dimensions
    const { length, breadth, height } = dimensions;
    if (!length || !breadth || !height) {
      return res.status(400).json({
        message: 'Invalid dimensions. Length, breadth, and height are required.',
        received: dimensions
      });
    }

    const parsedLength = parseFloat(length);
    const parsedBreadth = parseFloat(breadth);
    const parsedHeight = parseFloat(height);

    if (isNaN(parsedLength) || parsedLength <= 0 ||
        isNaN(parsedBreadth) || parsedBreadth <= 0 ||
        isNaN(parsedHeight) || parsedHeight <= 0) {
      return res.status(400).json({
        message: 'Invalid dimensions. All measurements must be positive numbers.',
        received: { length, breadth, height }
      });
    }

    // Validate category
    const validCategories = ['Sofa', 'Dining Table', 'TV Cabinets', 'Wardrobe', 'Tables'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category. Must be one of: ' + validCategories.join(', '),
        received: category
      });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Create relative path for the image
    const imagePath = '/uploads/' + path.basename(req.file.path);

    // Create product object
    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      image: imagePath,
      dimensions: {
        length: parsedLength,
        breadth: parsedBreadth,
        height: parsedHeight
      },
      category: category
    };

    console.log('Product data to be saved:', JSON.stringify(productData, null, 2));

    // Create and save the product
    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log('Saved product:', JSON.stringify(savedProduct, null, 2));

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message
    });

  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.image = '/uploads/' + path.basename(req.file.path);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,

      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}; 