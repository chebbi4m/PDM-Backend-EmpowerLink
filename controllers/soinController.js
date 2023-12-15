import asyncHandler from "express-async-handler";
import Soin from "../models/soin.js";





// @desc    Fetch all Soins
// @route   GET /soins
// @access  public
const getSoins = asyncHandler(async (req, res) => {
  const { idHopital } = req.query;
  console.log(idHopital)

  const soins = await Soin.find({idHopital: idHopital});
  res.json(soins);
  console.log(soins)
});

// @desc    Fetch Soin by id
// @route   GET /soins/:id
// @access  public
const getSoinById = asyncHandler(async (req, res) => {
  try {
    const soin = await Soin.findById(req.params.id);
    res.status(200).json(soin);
  } catch (error) {
    res.status(500).json(error);
    throw new Error("Soin not Found");
  }
});


// @desc    Create Soin
// @route   POST /soins
// @access  private/admin
const createSoin = asyncHandler(async (req, res) => {
  const { idHopital, nom, dateDeSoin, nbPlaceDispo } = req.body;
  //const soinId = await generateUniquesoinId(); 
  try {
    const newSoin = new Soin({
      idHopital,
      nom,
      dateDeSoin,
      nbPlaceDispo,
    });

    const savedSoin = await newSoin.save();
    res.json(savedSoin);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
/*async function generateUniquesoinId() {
  while (true) {
      const uniquesoinId = Math.floor(1000 + Math.random() * 9000); 
      const soinExists = await Soin.findOne({ soinId: uniquesoinId });
      if (!soinExists) {
          return SoinId;
      }
  }
}*/
// @desc    Update Soin
// @route   PUT /soins/:id
// @access  private/admin
const updateSoin = asyncHandler(async (req, res) => {
  const { nom, dateDeSoin, nbPlaceDispo } = req.body;

  const updatedSoin = await Soin.findById(req.params.id);
  if (updatedSoin) {
    updatedSoin.nom = nom;
    updatedSoin.dateDeSoin = dateDeSoin;
    updatedSoin.nbPlaceDispo = nbPlaceDispo;

    const updatedSoinResult = await updatedSoin.save();
    res.status(201).json(updatedSoinResult);
  } else {
    res.status(401);
    throw new Error("Soin not found");
  }
});

// @desc    Delete Soin
// @route   DELETE /soins/:id
// @access  private/admin
const deleteSoin = asyncHandler(async (req, res) => {
  try {
    await Soin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Soin Removed" });
  } catch (err) {
    res.status(404).json(err);
  }
});

// @desc    Get Soin by Nom
// @route   GET /soins/nom/:nom
// @access  public
const getSoinByNom = asyncHandler(async (req, res) => {
  const nom = req.params.nom;

  const soins = await Soin.find({ nom: { $regex: new RegExp(nom, "i") } });

  if (soins && soins.length > 0) {
    res.json(soins);
  } else {
    res.status(404).json({ message: "Aucun soin trouvÃ© avec ce nom" });
  }
});
const makeReservation = asyncHandler(async (req, res) => {
  const { soinId, userId } = req.body;

  try {
    const soin = await Soin.findById(soinId);

    if (!soin) {
      return res.status(404).json({ message: "Soin non trouvÃ©" });
    }

    // VÃ©rifier si des places sont disponibles
    if (soin.nbPlaceDispo > 0) {
      // RÃ©duire le nombre de places disponibles
      soin.nbPlaceDispo--;

      // Assurez-vous que participants est un tableau avant de pousser
      soin.participants = soin.participants || [];
      
      // Ajouter l'ID de l'utilisateur Ã  la liste des participants
      soin.participants.push(userId);

      // Enregistrez la modification du soin
      const updatedSoin = await soin.save();

      return res.json({
        message: "RÃ©servation rÃ©ussie",
        soin: updatedSoin,
      });
    } else {
      return res.status(400).json({ message: "Aucune place disponible pour le soin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la rÃ©servation" });
  }
});


export {
  getSoins,
  getSoinById,
  getSoinByNom,
  createSoin,
  updateSoin,
  deleteSoin,
  makeReservation,
};