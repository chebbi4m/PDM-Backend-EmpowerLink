import mongoose from "mongoose";

const { Schema, model } = mongoose;

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
    views: {
      default: null,
      type: Number,
    },
    isRecommended: {
      default: null,
      type: Boolean,
    },
    isTrending: {
      default: null,
      type: Boolean,
    },
    isPopular: {
      default: null,
      type: Boolean,
    },
    image: {
      default: null,
      type: String,
    },
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
);

export default model('Education', EducationSchema);