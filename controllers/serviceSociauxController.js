import asyncHandler from "express-async-handler";
import ServiceSociaux from "../models/serviceSociaux.js"; // Assurez-vous que le chemin du modÃ¨le est correct

// @desc    Fetch all Service Sociaux
// @route   GET /serviceSociaux
// @access  public
const getServiceSociaux = asyncHandler(async (req, res) => {
  const serviceSociaux = await ServiceSociaux.find({});
  res.json(serviceSociaux);
});

// @desc    Fetch Service Sociaux by id
// @route   GET /serviceSociaux/:id
// @access  public
const getServiceSociauxById = asyncHandler(async (req, res) => {
  try {
    const serviceSociaux = await ServiceSociaux.findById(req.params.id);
    res.status(200).json(serviceSociaux);
  } catch (error) {
    res.status(500).json(error);
    throw new Error("Service Sociaux not Found");
  }
});

// @desc    Create Service Sociaux
// @route   POST /serviceSociaux
// @access  private/admin
const createServiceSociaux = asyncHandler(async (req, res) => {
  const { nom, description,nbParticipant  , lieu, horaireOuverture } = req.body;

  try {
    const newServiceSociaux = new ServiceSociaux({
      nom,
      description,
      lieu,
      horaireOuverture,
   
    });

    const savedServiceSociaux = await newServiceSociaux.save();
    res.json(savedServiceSociaux);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @desc    Update Service Sociaux
// @route   PUT /serviceSociaux/:id
// @access  private/admin
const updateServiceSociaux = asyncHandler(async (req, res) => {
  const { nom, description, lieu, horaireOuverture,nbParticipant } = req.body;

  const updatedServiceSociaux = await ServiceSociaux.findById(req.params.id);
  if (updatedServiceSociaux) {
    updatedServiceSociaux.nom = nom;
    updatedServiceSociaux.description = description;
    updatedServiceSociaux.lieu = lieu;
    updatedServiceSociaux.horaireOuverture = horaireOuverture;
    updatedServiceSociaux.nbParticipant = nbParticipant;

    const updatedService = await updatedServiceSociaux.save();
    res.status(201).json(updatedService);
  } else {
    res.status(401);
    throw new Error("Service Sociaux not found");
  }
});

// @desc    Delete Service Sociaux
// @route   DELETE /serviceSociaux/:id
// @access  private/admin
const deleteServiceSociaux = asyncHandler(async (req, res) => {
  try {
    await ServiceSociaux.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service Sociaux Removed" });
  } catch (err) {
    res.status(404).json(err);
  }
});
//Get Service Sociaux by Nom
const getServiceSociauxByNom = asyncHandler(async (req, res) => {
  const nom = req.params.nom;

  const serviceSociaux = await ServiceSociaux.find({ nom: { $regex: new RegExp(nom, "i") } });

  if (serviceSociaux && serviceSociaux.length > 0) {
    res.json(serviceSociaux);
  } else {
    res.status(404).json({ message: "Aucun service social trouvÃ© avec ce nom" });
  }
});


export {
  getServiceSociaux,
  getServiceSociauxById,
  getServiceSociauxByNom,
  createServiceSociaux,
  updateServiceSociaux,
  deleteServiceSociaux,
  getServiceSociauByNom,
  
};
export const addhopital = async (req, res) => {
  const hopitalId = req.body.formationId; 
  const userId = req.body.userId; 

  try {
    // Find the hopital by ID
    const hopital = await hopital.findById(hopitalId);

    if (!hopital) {
      return res.status(404).json({ message: 'hopital not found' });
    }

    // Add the user ID to the participants array
    hopital.participants.push(userId);
 
    // Update the number of participants (optional)
    hopital.nbParticipant = hopital.participants.length;

    // Save the updated hopital
    await hopital.save();

    return res.status(200).json({message: 'Participant added successfully' ,hopital});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getServiceSociauByNom = asyncHandler(async (req, res) => {
  try {
    // Assuming 'nom' is the field you want to use for the search
    const serviceSociaux = await ServiceSociaux.findOne({ nom: req.params.nom });

    if (!serviceSociaux) {
      // Handle the case where the serviceSociaux with the specified 'nom' is not found
      return res.status(404).json({ message: "Service Sociaux not found" });
    }

    res.status(200).json(serviceSociaux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export const addServiceSociaux = asyncHandler(async (req, res) => {
  const { nom, description, lieu, horaireOuverture, nbPlace, nbParticipant, services } = req.body;
  console.log(req.body);
  try {
    const newServiceSociaux = new ServiceSociaux({
      nom,
      description,
      lieu,
      horaireOuverture,
      nbPlace,
      nbParticipant,
      services,
    });

    const savedServiceSociaux = await newServiceSociaux.save();
    res.status(201).json(savedServiceSociaux);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
export const addServiceToServiceSociaux = asyncHandler(async (req, res) => {
  const { service } = req.body;
  const { id } = req.body;

  try {
    const serviceSociaux = await ServiceSociaux.findById(id);

    if (!serviceSociaux) {
      return res.status(404).json({ message: "Service Sociaux not found" });
    }

    // Add the new service to the existing services array
    serviceSociaux.services.push(service);

    // Save the updated Service Sociaux
    const updatedServiceSociaux = await serviceSociaux.save();

    res.status(201).json(updatedServiceSociaux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});