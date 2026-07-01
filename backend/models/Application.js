import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
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
      required: [true, 'Please add a role/position'],
      trim: true,
    },
    packageOffered: {
      type: Number, // LPA
      default: 0,
    },
    location: {
      type: String,
      default: '',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    currentStage: {
      type: String,
      enum: [
        'Interested',
        'Applied',
        'Online Assessment',
        'Technical Interview',
        'HR Interview',
        'Offer Received',
        'Rejected',
      ],
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
