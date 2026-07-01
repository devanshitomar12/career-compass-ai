import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { checkAndUnlockBadges } from '../utils/badgeTrigger.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Find badges
      const badges = await Badge.find({ user: user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        knownSkills: user.knownSkills,
        projectsCount: user.projectsCount,
        dsaProgress: user.dsaProgress,
        resumePath: user.resumePath,
        badges: badges,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.targetRole = req.body.targetRole !== undefined ? req.body.targetRole : user.targetRole;
      user.knownSkills = req.body.knownSkills !== undefined ? req.body.knownSkills : user.knownSkills;
      user.projectsCount = req.body.projectsCount !== undefined ? Number(req.body.projectsCount) : user.projectsCount;
      user.dsaProgress = req.body.dsaProgress !== undefined ? Number(req.body.dsaProgress) : user.dsaProgress;

      const updatedUser = await user.save();
      
      // Trigger badge unlocked evaluation check
      await checkAndUnlockBadges(user._id);
      const badges = await Badge.find({ user: user._id });

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        targetRole: updatedUser.targetRole,
        knownSkills: updatedUser.knownSkills,
        projectsCount: updatedUser.projectsCount,
        dsaProgress: updatedUser.dsaProgress,
        resumePath: updatedUser.resumePath,
        badges: badges,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload resume
// @route   POST /api/auth/resume
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save path relative to server root
    const resumeRelativePath = `/uploads/${req.file.filename}`;
    user.resumePath = resumeRelativePath;
    await user.save();

    // Trigger badge evaluation check
    await checkAndUnlockBadges(user._id);
    const badges = await Badge.find({ user: user._id });

    res.json({
      message: 'Resume uploaded successfully',
      resumePath: resumeRelativePath,
      badges: badges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
