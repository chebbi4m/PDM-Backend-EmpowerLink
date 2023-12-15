import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const soinSchema = new Schema({

  idHopital: {
    type: String, // or any other type you want to use for the hospital ID
    required: true,
  },

  nom: {
    type: String,
    required: true,
  },
  dateDeSoin: {
    type: Date,
    required: true,
  },
  nbPlaceDispo: {
    type: Number,
    default: 0,
  },
  participant:
  {
    type: String,
    required: false
  }
 
},
{
  timestamps: true, 
});

//export default model('soin', soinSchema);
export default model('Soin', soinSchema);