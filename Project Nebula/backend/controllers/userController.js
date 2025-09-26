const User = require('../models/User');
const bcrypt = require('bcrypt');

// Basic payload validation function
function validateUserPayload(payload) {
  const requiredFields = ['name', 'email', 'password', 'ageGroup', 'typeOfMutation'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      return `${field} is required.`;
    }
  }
  
  if (!payload.termsAccepted) {
    return 'You must agree to the Terms of Service';
  }
  
  // Validate password length
  if (payload.password && payload.password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return null;
}

exports.registerUser = async (req, res) => {
  console.log('Received registration data:', {...req.body, password: '[HIDDEN]'});
  const error = validateUserPayload(req.body);
  if (error) {
    console.log('Validation error:', error);
    return res.status(400).json({ success: false, message: error });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'A user with this email already exists' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user with hashed password
    const userData = {
      ...req.body,
      password: hashedPassword
    };

    const user = new User(userData);
    await user.save();

    // Send response without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      success: true, 
      user: userResponse,
      message: 'Registration successful'
    });
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration. Please try again.' 
    });
  }
};
