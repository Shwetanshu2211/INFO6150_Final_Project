const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).fields([{ name: 'image', maxCount: 1 }]);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message
    });
  }
  next();
};

// Middleware to parse form data
const parseFormData = (req, res, next) => {
  if (req.files && req.files.image) {
    req.file = req.files.image[0];
  }
  next();
};


// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', auth, isAdmin, upload, handleMulterError, parseFormData, createProduct);
router.put('/:id', auth, isAdmin, upload, handleMulterError, parseFormData, updateProduct);

router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router; 