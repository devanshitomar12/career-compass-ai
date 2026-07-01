import mongoose from 'mongoose';

const interviewExperienceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please add a role'],
      trim: true,
    },
    experience: {
      type: String,
      default: '',
    },
    questions: {
      type: [String],
      default: [],
    },
    personalNotes: {
      type: String,
      default: '',
    },
    preparationStatus: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Ready'],
      default: 'Not Started',
    },
  },
  {
    timestamps: true,
  }
);

const InterviewExperience = mongoose.model('InterviewExperience', interviewExperienceSchema);
export default InterviewExperience;
