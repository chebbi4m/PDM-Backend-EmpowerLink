import mongoose from 'mongoose';

const opportuniteModelSchema = new mongoose.Schema({
  skill: String,
  contactEmail: String,
  salary: String,
  nomEntreprise: String,
  title: String,
  description: String,
  lieu: String,
  Typedecontrat: String,
  applicants: {
    type: [String], // Array of strings
    default: [] // Default value is an empty array
  },
});

const Opportunite = mongoose.model('Opportunite', opportuniteModelSchema);

export default Opportunite;

opportuniteModelSchema.statics.getOpportuniteById = function (opportuniteId) {
  return this.findById(opportuniteId).exec();
};