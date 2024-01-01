import axios from 'axios';
import Education from '../models/Education.js';

export const createEducation = async (req, res) => {
  const { type, description, dure } = req.body;
  const education = new Education();
  education.type = type;
  education.description = description;
  education.dure = dure;
  await education.save();
  res.status(201).send(education);
};

export const getAllEducations = async (req, res) => {
  var educations = await Education.find();
  res.status(200).send(educations);
};

export const getEducationById = async (req, res) => {
  const id = req.headers.ideducation;
  console.log(id);

  var education = await Education.findById(id);
  res.status(200).send(education);
};

export const updateEducation = async (req, res) => {
  const { type, description, dure } = req.body;
  console.log(req.headers);
  const education = await Education.findById(req.headers.educationid);
  if (education) {
    education.type = type;
    education.description = description;
    education.dure = dure;

    await education.save();

    res.status(201).send(education);
  } else {
    res.status(301).send('erreur');
  }
};

export const removeEducation = async (req, res) => {
  const { ideducation } = req.body;

  try {
    const education = await Education.findById(ideducation);

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    await education.remove();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};