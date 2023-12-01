import experienceModel from '../models/experience.js';
import userModel from '../models/user.js';
import nodemailer from 'nodemailer';

export const createExperience = async (req, res) => {
    console.log(req.body.communityId);

    const { username, title, text, communityId } = req.body;
    const image = req.file ? req.file.filename : '';

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

    try {
        const savedExperience = await newExperience.save();

        // Emit a socket event to notify connected clients
        

        // Check for mentions in the text
        const mentions = extractMentionsFromText(text);

        // Send emails to mentioned users
        await sendEmailsToMentionedUsers(username, mentions);

        res.status(201).json({ message: 'Experience created successfully', experience: savedExperience });
    } catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

async function sendEmailsToMentionedUsers(senderUsername, mentions) {
    try {
        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chebbi.mohamed.1@esprit.tn', // Replace with your Gmail address
                pass: '223JMT1915', // Replace with your Gmail password or an app-specific password
            },
        });

        for (const mention of mentions) {
            const mentionedUser = await userModel.findOne({ username: mention });

            if (mentionedUser) {
                // Compose email message
                const mailOptions = {
                    from: 'chebbi.mohamed.1@esprit.tn', // Replace with your Gmail address
                    to: mentionedUser.email,
                    subject: `You were mentioned by ${senderUsername}`,
                    text:` Hey ${mentionedUser.username},\n\nYou were mentioned by ${senderUsername} in a new experience.`,
                };

                // Send email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log(`Email sent to ${mentionedUser.email}: ${info.response}`);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

function extractMentionsFromText(text) {
    const mentionRegex = /@(\w+)(?=\s|$)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push(match[1]);
    }
    return mentions;
}

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