import mongoose from 'mongoose';

const opportuniteModelSchema = new mongoose.Schema({
  title: String,
  description: String,
  lieu: String,
  Typedecontrat: String,
});

const Opportunite = mongoose.model('Opportunite', opportuniteModelSchema);

export default Opportunite;
