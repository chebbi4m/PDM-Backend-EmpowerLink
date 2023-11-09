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
  lieu: {
    type: String,
    required: false
  },
  horaireOuverture: {
    type: Date, // Changement du type en Date
    required: false
  },
  // Vous pouvez ajouter d'autres champs spécifiques au modèle serviceSociaux ici
},
{
  timestamps: true
});

export default model('ServiceSociaux', serviceSociauxSchema);
