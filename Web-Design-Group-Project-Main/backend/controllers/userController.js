const User = require('../models/User');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register new user
exports.register = async (req, res) => {const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
      role: role || 'customer'  // Use provided role or default to 'customer'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'email', 'password', 'address'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        address: req.user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}; 

  try {
    console.log('Register endpoint called with body:', JSON.stringify(req.body, null, 2));
    const { name, email, password, securityQuestion, securityAnswer, role, artistInfo } = req.body;
    
    console.log('Destructured data:', { 
      name, email, securityQuestion, securityAnswer, role,
      artistInfo: JSON.stringify(artistInfo)
    });

    // Check MongoDB connection status
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', dbState, 
      '(0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
      role: role || 'customer'  // Use provided role or default to 'customer'
    });
    
    // Handle artistInfo separately
    if (role === 'artist' && artistInfo) {
      console.log('Setting artistInfo for artist user:', artistInfo);
      user.artistInfo = artistInfo;
      
      // Explicitly examine the user object's artistInfo
      console.log('User artistInfo after assignment:', user.artistInfo);
      console.log('User artistInfo constructor:', user.artistInfo.constructor.name);
      console.log('User artistInfo keys:', Object.keys(user.artistInfo));
      console.log('User artistInfo bio value:', user.artistInfo.bio);
    }
    
    console.log('User object before saving:', JSON.stringify(user, null, 2));
    
    try {
      await user.save();
      console.log('User saved successfully with ID:', user._id);
      console.log('Saved user artistInfo:', user.artistInfo);
      
      // Verify data was saved correctly by retrieving from DB
      const savedUser = await User.findById(user._id);
      console.log('Retrieved user from DB:', savedUser ? 'Found' : 'Not Found');
      console.log('Retrieved artistInfo from DB:', savedUser?.artistInfo);
    } catch (saveError) {
      console.error('Error saving user to MongoDB:', saveError);
      throw saveError;
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        artistInfo: user.artistInfo
      },
      token
    });
  } catch (error) {
    console.error('Error in register function:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user

exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get user profile

exports.getProfile = async (req, res) => {

  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        address: req.user.address,
        artistInfo: req.user.artistInfo
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting profile', error: error.message });
  }
};

// Update user profile

exports.updateProfile = async (req, res) => {

  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'email', 'password', 'address', 'artistInfo'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        address: req.user.address,
        artistInfo: req.user.artistInfo
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }

};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser
