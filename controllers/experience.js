import experienceModel from '../models/experience.js';
import { validationResult } from 'express-validator';
import multer from '../middlewares/multer-config.js'; // Import your Multer configuration

export const createExperience = async (req, res) => {
    try {
        // Use the Multer middleware directly (do not call it as a function)
        multer.single('image')(req, res, async function (err) {
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({error:err, message: 'Image upload failed' });
            }

            const { username, title, text, communityId } = req.body;
            const image = req.file ? req.file.filename : ''; // Check if an image file was uploaded

            const experienceId = await generateUniqueExperienceId();

            const newExperience = new experienceModel({
                username,
                communityId,
                title,
                text,
                image,
                experienceId,
                createdAt: new Date(),
            });

            const savedExperience = await newExperience.save();

            res.status(201).json({ message: 'Experience created successfully', experience: savedExperience });
        });
    } catch (error) {
        console.error('Create experience error:', error);
        res.status(500).json({ message: error.message });
    }
};



async function generateUniqueExperienceId() {
    while (true) {
        const uniqueExperienceId = Math.floor(1000 + Math.random() * 9000); 
        const experienceExists = await experienceModel.findOne({ experienceId: uniqueExperienceId });
        if (!experienceExists) {
            return uniqueExperienceId;
        }
    }
}


export const editExperience = async (req, res) => {
    const { experienceId, title, text, image } = req.body;

    try {
        const experience = await experienceModel.findOne({ experienceId: experienceId });
        console.log(experience);

        if (!experience) {
            return res.status(404).json({ message: 'experience not found' });
        }

        experience.title = title || experience.title;
        experience.text = text || experience.text;
        experience.image = image || experience.image;

        const newExperience = await experience.save();

        res.status(200).json({ experience: newExperience, message: 'Experience updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteExperience = async (req, res) => {
    const experienceId = req.body.experienceId;
    console.log(experienceId)
    try {
        const deletedExperience = await experienceModel.findOneAndDelete({ experienceId: experienceId });

        if (!deletedExperience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        res.status(200).json({ message: 'Experience deleted', experienceId: deleteExperience });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getExperienceById = async (req, res) => {
    const experienceId = req.body.experienceId;
    const experience = await experienceModel.findOne({ experienceId: experienceId });
    res.status(200).json({ experience: experience });
}
export const getExperiences = async (req, res) => {
    const experience = await experienceModel.find();
    res.status(200).json({ experiences: experience });
}

export const getExperiencesSortedByDate = async (req, res) => {
    try {
        const experiences = await experienceModel.find()
            .sort({ createdAt: -1 }); // Sorting by createdAt field in descending order (newest to oldest)
        
        res.status(200).json({ experiences });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




export const getMyExperiences = async(req, res) => {
    const experinceCreator = req.body.username;
    const experience = await experienceModel.find({ username: experinceCreator });
    res.status(200).json({ experiences: experience });
}

export const getExperiencesByCommunity = async (req, res) => {
    const communityId = req.params.communityId; // Update to use params instead of body
    try {
        const experiences = await experienceModel.find({ communityId });

        // Send experiences array directly without wrapping
        res.status(200).json(experiences);
        console.log(experiences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

  