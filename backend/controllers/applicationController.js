import Application from '../models/Application.js';
import { checkAndUnlockBadges } from '../utils/badgeTrigger.js';

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({
      applicationDate: -1,
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  const { companyName, role, packageOffered, location, applicationDate, currentStage } =
    req.body;

  if (!companyName || !role) {
    return res.status(400).json({ message: 'Company name and role are required' });
  }

  try {
    const application = await Application.create({
      user: req.user._id,
      companyName,
      role,
      packageOffered: packageOffered || 0,
      location: location || '',
      applicationDate: applicationDate || Date.now(),
      currentStage: currentStage || 'Applied',
    });

    // Check for achievements
    await checkAndUnlockBadges(req.user._id);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.companyName = req.body.companyName || application.companyName;
    application.role = req.body.role || application.role;
    application.packageOffered =
      req.body.packageOffered !== undefined
        ? req.body.packageOffered
        : application.packageOffered;
    application.location = req.body.location !== undefined ? req.body.location : application.location;
    application.applicationDate =
      req.body.applicationDate || application.applicationDate;
    application.currentStage = req.body.currentStage || application.currentStage;

    const updatedApplication = await application.save();

    // Recheck badges
    await checkAndUnlockBadges(req.user._id);

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await application.deleteOne();
    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
