import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a note title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add note content'],
    },
    category: {
      type: String,
      enum: ['Interview', 'Technical', 'HR', 'General'],
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;
