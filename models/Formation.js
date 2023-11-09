import { Schema, model } from 'mongoose';

const FormationSchema = new Schema(
  {
    title: {
      default: 'title',
      type: String,
    },
    nbPlace: {
      default: null,
      type: Number,
    },
    nbParticipant: {
      default: null,
      type: Number,
    },
    description: {
      default: 'description',
      type: String,
    },
    image: {
      default: 'image',
      type: String,
    },
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
);

export default model('Formation', FormationSchema);
