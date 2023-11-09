import asyncHandler from "express-async-handler";
import ServiceSociaux from "../models/serviceSociaux.js"; // Assurez-vous que le chemin du modèle est correct

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
  const { nom, description, lieu, horaireOuverture } = req.body;

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
  const { nom, description, lieu, horaireOuverture } = req.body;

  const updatedServiceSociaux = await ServiceSociaux.findById(req.params.id);
  if (updatedServiceSociaux) {
    updatedServiceSociaux.nom = nom;
    updatedServiceSociaux.description = description;
    updatedServiceSociaux.lieu = lieu;
    updatedServiceSociaux.horaireOuverture = horaireOuverture;

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

export {
  getServiceSociaux,
  getServiceSociauxById,
  createServiceSociaux,
  updateServiceSociaux,
  deleteServiceSociaux,
};
