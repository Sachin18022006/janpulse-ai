import mongoose from 'mongoose';

const upvoteSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee that each user can upvote a complaint only once
upvoteSchema.index({ complaint: 1, user: 1 }, { unique: true });

export default mongoose.model('Upvote', upvoteSchema);
