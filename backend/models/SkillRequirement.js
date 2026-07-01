import mongoose from 'mongoose';

const skillRequirementSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Please add a role name'],
      unique: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const SkillRequirement = mongoose.model('SkillRequirement', skillRequirementSchema);
export default SkillRequirement;
