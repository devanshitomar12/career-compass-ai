import SkillRequirement from '../models/SkillRequirement.js';
import User from '../models/User.js';

// @desc    Get skill gap analysis for a target role
// @route   GET /api/skills/analyze
// @access  Private
export const analyzeSkillGap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const targetRole = req.query.role || user.targetRole;

    if (!targetRole) {
      return res.status(400).json({
        message: 'No target role specified. Please select one or update your profile.',
      });
    }

    const requirement = await SkillRequirement.findOne({
      roleName: { $regex: new RegExp(`^${targetRole}$`, 'i') },
    });

    if (!requirement) {
      return res.status(404).json({
        message: `No predefined skill requirements found for role: ${targetRole}`,
      });
    }

    const userSkills = (user.knownSkills || []).map((s) => s.trim().toLowerCase());
    const requiredSkills = requirement.skills || [];

    const matchingSkills = [];
    const missingSkills = [];

    requiredSkills.forEach((skill) => {
      if (userSkills.includes(skill.toLowerCase())) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const matchPercentage =
      requiredSkills.length > 0
        ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
        : 0;

    // Custom learning recommendations based on missing skills
    const recommendations = missingSkills.map((skill) => {
      return {
        skill,
        suggestion: `Build a small hands-on project using ${skill} and read its official documentation.`,
        resources: [
          { name: `Official ${skill} Docs`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' documentation')}` },
          { name: `freeCodeCamp ${skill} Guide`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}` },
        ],
      };
    });

    res.json({
      targetRole,
      requiredSkills,
      matchingSkills,
      missingSkills,
      matchPercentage,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available placement roles in database
// @route   GET /api/skills/roles
// @access  Public
export const getAvailableRoles = async (req, res) => {
  try {
    const roles = await SkillRequirement.find({}, 'roleName');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
