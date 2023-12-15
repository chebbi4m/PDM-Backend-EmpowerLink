import Formation from '../models/formation.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from '../models/user.js';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const formationID = req.params.id;
    const dir = `./uploads/formations/formation-${formationID}/images/`;
    fs.promises.mkdir(dir, { recursive: true })
      .then(() => {
        cb(null, dir);
      })
      .catch((error) => cb(error, dir));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage }).any();

async function setupFormationsFolder(id) {
  const dir = `./uploads/formations/formation-${id}`;
  await fs.promises.mkdir(dir);
  const dir2 = `./uploads/formations/formation-${id}/images`;
  await fs.promises.mkdir(dir2);
  console.log('folder created');
}

export const createFormation = async (req, res) => {
  const { title, nbPlace, nbParticipant, description } = req.body;
  const formation = new Formation();
  formation.title = title;
  formation.nbPlace = nbPlace;
  formation.nbParticipant = nbParticipant;
  formation.description = description;
  await formation.save();
  res.status(201).send(formation);
};

export const uploadImages = async (req, res) => {
  const formationId = req.params.id;

  await setupFormationsFolder(formationId);

  upload(req, res, async (err) => {
    console.log('uploaded');
    var pathImage = req.files[0].path;
    pathImage = pathImage.replaceAll("\\", "/");
    const uploadFormation = await Formation.updateOne(
      { _id: formationId },
      {
        $set: {
          image: 'http://localhost:9090/' + pathImage,
        },
      }
    );
    res.status(200).send({ message: 'image uploaded' });
  });
};

    

export const getFormationById = async (req, res) => {
  const id = req.headers.idformation;
  console.log(id);

  var formation = await Formation.findById(id);
  res.status(200).send(formation);
};

export const updateFormation = async (req, res) => {
  const { title, nbPlace, nbParticipant, description } = req.body;
  console.log(req.headers);
  const formation = await Formation.findById(req.headers.formationid);
  if (formation) {
    if (req.file) {
      formation.image =
        'http://localhost:9090/' + req.file.path.replaceAll("\\", "/");
    }

    formation.title = title;
    formation.nbPlace = nbPlace;
    formation.nbParticipant = nbParticipant;
    formation.description = description;

    await formation.save();

    res.status(201).send(formation);
  } else {
    res.status(301).send('erreur');
  }
};

export const removeFormation = async (req, res) => {
  const { idformation } = req.body;

  try {
    const formation = await Formation.findById(idformation);

    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    await formation.remove();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAllformations = async (req, res) => {
  var formations = await Formation.find();
  res.status(200).send(formations);
};
export const addParticipant = async (req, res) => {
  const formationId = req.body.formationId;
  const userId = req.body.userId;

  try {
    // Find the formation by ID
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    // Check if the user ID is already in the participants array
    if (formation.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already exists in participants' });
    }

    // Add the user ID to the participants array
    formation.participants.push(userId);

    // Update the number of participants (optional)
    formation.nbParticipant = formation.participants.length;

    // Save the updated formation
    await formation.save();

    return res.status(200).json({ message: 'Participant added successfully', formation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const getFormationsByUserId = async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is passed in the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId); // Fix the typo: change 'user' to 'User'

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find formations where the user is a participant
    const formations = await Formation.find({ participants: userId }); // Simplify the query

    res.status(200).json(formations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};