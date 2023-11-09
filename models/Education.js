import { Schema, model } from 'mongoose';

const EducationSchema = new Schema(
  {
    type: {
      default: 'type',
      type: String,
    },
    description: {
      default: 'description',
      type: String,
    },
    dure: {
      default: null,
      type: Number,
    },
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
);

export default model('Education', EducationSchema);
