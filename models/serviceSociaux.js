import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const serviceSociauxSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref : "User",
    default: []
  }],
  nbPlace: {
    default: 0,
    type: Number,
  },
  nbParticipant: {
    default: 1,
    type: Number,
  },
  lieu: {
    type: String,
    required: false
  },
  services: [
    {
      type: String,
      required: false
    }
  ],
  
  horaireOuverture: {
    type: Date, // Changement du type en Date
    required: false
  },
  // Vous pouvez ajouter d'autres champs spÃ©cifiques au modÃ¨le serviceSociaux ici
},
{
  timestamps: true
});

export default model('ServiceSociaux', serviceSociauxSchema);