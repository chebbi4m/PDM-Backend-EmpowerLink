const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Import the "Offreemploi" routes
const offreemploiRoutes = require('./routes/offreemploiRoutes');

// Use the "Offreemploi" routes under the "/api" base path
app.use('/api', offreemploiRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/empowerlink", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log("Connected to DB");
      app.listen(3000, () => {
        console.log("Server started on port 3000");
      });
    })
    .catch((error) => {
      console.error("Error connecting to DB:", error);
    });
  
  module.exports = app;
