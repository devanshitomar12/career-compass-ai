import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      enum: ['First Application', '10 Applications', 'Interview Ready', 'Offer Received'],
    },
    description: {
      type: String,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate badges for the same user
badgeSchema.index({ user: 1, name: 1 }, { unique: true });

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
