import InterviewExperience from '../models/InterviewExperience.js';

// @desc    Get all interview experiences
// @route   GET /api/interviews
// @access  Private
export const getInterviewExperiences = async (req, res) => {
  try {
    const experiences = await InterviewExperience.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an interview experience
// @route   POST /api/interviews
// @access  Private
export const createInterviewExperience = async (req, res) => {
  const { companyName, role, experience, questions, personalNotes, preparationStatus } =
    req.body;

  if (!companyName || !role) {
    return res.status(400).json({ message: 'Company name and role are required' });
  }

  try {
    const experienceLog = await InterviewExperience.create({
      user: req.user._id,
      companyName,
      role,
      experience: experience || '',
      questions: Array.isArray(questions) ? questions : [],
      personalNotes: personalNotes || '',
      preparationStatus: preparationStatus || 'Not Started',
    });
    res.status(201).json(experienceLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an interview experience
// @route   PUT /api/interviews/:id
// @access  Private
export const updateInterviewExperience = async (req, res) => {
  try {
    const experienceLog = await InterviewExperience.findById(req.params.id);

    if (!experienceLog) {
      return res.status(404).json({ message: 'Experience log not found' });
    }

    if (experienceLog.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    experienceLog.companyName = req.body.companyName || experienceLog.companyName;
    experienceLog.role = req.body.role || experienceLog.role;
    experienceLog.experience = req.body.experience !== undefined ? req.body.experience : experienceLog.experience;
    experienceLog.questions = Array.isArray(req.body.questions) ? req.body.questions : experienceLog.questions;
    experienceLog.personalNotes = req.body.personalNotes !== undefined ? req.body.personalNotes : experienceLog.personalNotes;
    experienceLog.preparationStatus = req.body.preparationStatus || experienceLog.preparationStatus;

    const updatedExperience = await experienceLog.save();
    res.json(updatedExperience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an interview experience
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterviewExperience = async (req, res) => {
  try {
    const experienceLog = await InterviewExperience.findById(req.params.id);

    if (!experienceLog) {
      return res.status(404).json({ message: 'Experience log not found' });
    }

    if (experienceLog.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await experienceLog.deleteOne();
    res.json({ message: 'Experience log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
