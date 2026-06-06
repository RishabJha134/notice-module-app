import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notice', noticeSchema);