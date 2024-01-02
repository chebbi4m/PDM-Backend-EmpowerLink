import experienceModel from '../models/experience.js';
import { validationResult } from 'express-validator';
import multer from '../middlewares/multer-config.js'; // Import your Multer configuration
import badWordsList  from '../public/statics/badwords.js';
import { io } from '../server.js'
import OpenAI from "openai";



const apiKey = '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';

const openai = new OpenAI({ apiKey: apiKey });

export const createExperience = async (req, res) => { // Add 'io' as a parameter
    try {
      multer.single('image')(req, res, async function (err) {
        if (err) {
          console.error('Multer error:', err);
          return res.status(400).json({ error: err, message: 'Image upload failed' });
        }
  
        const { username, title, text, communityId } = req.body;

        let filteredText = filterBadWords(text);
  
        const experienceId = await generateUniqueExperienceId();
  
        
        const apiResponse = await callOpenAI(filteredText); // Pass filteredText to the API
  
        // Process the API response
        let cleanedResponse = apiResponse;
        if (apiResponse.startsWith("bad :")) {
          cleanedResponse = apiResponse.substring(5);
          if (cleanedResponse.startsWith("bad :")) {
            cleanedResponse = cleanedResponse.substring(5); // Remove "bad :" prefix
            
          } // Remove "bad :" prefix
          filteredText = "*****"
        } else if (apiResponse.startsWith("bad:")) {
            cleanedResponse = cleanedResponse.substring(5);
            filteredText = "*****"
        } else if (apiResponse.startsWith("Bad:")) {
            cleanedResponse = cleanedResponse.substring(5);
            filteredText = "*****"
        } else if (apiResponse.startsWith("Bad :")) {
            cleanedResponse = cleanedResponse.substring(5);
            filteredText = "*****"
        } else if (apiResponse.startsWith("good :")) {
          cleanedResponse = ""; // Set to empty string for "good :" prefix
        }

        const newExperience = new experienceModel({
            username,
            communityId,
            title,
            text: filteredText,
            image: "no image",
            experienceId,
            createdAt: new Date(),
          });
    
          const savedExperience = await newExperience.save();
  
        // Emit an event to notify about the new experience
        io.emit('newExperience', savedExperience);
        console.log("emitted")
  
        res.status(201).json({
          message: 'Experience created successfully',
          experience: savedExperience,
          apiResponse: cleanedResponse, // Include the processed API response in the JSON output
        });
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

// Function to filter bad words in the text
function filterBadWords(text) {
    let filteredText = text;

    badWordsList.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });

    return filteredText;
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getExperiencesByCommunityIOS = async (req, res) => {
    const communityId = req.query.communityId; // Update to use params instead of body
    try {
        const experiences = await experienceModel.find({ communityId: communityId });

        // Send experiences array directly without wrapping
        res.status(200).json(experiences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function callOpenAI(messageContent) {
    try {
        const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Give me a response to this as a content moderation manager (don't mention that) [if the text is harmful start with "bad:" if its not bad then start with "good:"] make your answer as short as possible (max 15 words) the message is "${messageContent} "`,
            },
        ],
        model: "gpt-3.5-turbo",
    });
        console.log(completion.choices[0].message.content)
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        return null; // Handle the error by returning null or another default value
    }
}
  