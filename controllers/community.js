import communityModel from "../models/community.js";
import { validationResult } from 'express-validator';

export const createCommunity = async (req, res) => {
    console.log(req.body.username)
     
    try {
        
        const { 
            username,
            name,
            category,
            objectif,
        } = req.body;
        const communityExists = await communityModel.findOne({ name });

        // Check if community name already exists
        console.log("vvvv")
        console.log(req.body.username)
        console.log("vvvv")
        

        if (communityExists) {
            return res.status(400).json({ message: "Community name already exists, choose another name" });
        }

        // Generate a unique 4-digit community ID
        const communityId = await generateUniqueCommunityId(); // Await the result

        // Create a new community with the current timestamp and unique ID
        const newCommunity = new communityModel({
            username,
            name,
            category,
            objectif,
            communityId, // Add the community ID
            createdAt: new Date(), // Add the current timestamp
        });

        // Save the new community to the database
        const savedCommunity = await newCommunity.save(); 

        res.status(201).json({ message: "Community created successfully", community: savedCommunity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function generateUniqueCommunityId() {
    while (true) {
        const uniqueCommunityId = Math.floor(1000 + Math.random() * 9000); 
        const communityExists = await communityModel.findOne({ communityId: uniqueCommunityId });
        if (!communityExists) {
            return uniqueCommunityId;
        }
    }
}


export const editCommunity = async (req, res) => {
    const { communityId, name, image } = req.body;

    try {
        const community = await communityModel.findOne({ communityId: communityId });
        console.log(community);

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        community.name = name || community.name;
        community.image = image || community.image;

        const newCommunity = await community.save();

        res.status(200).json({ community: newCommunity, message: 'Community updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCommunity = async (req, res) => {
    const communityId = req.body.groupId;
    console.log(communityId)
    try {
        const deletedCommunity = await communityModel.findOneAndDelete({ communityId: communityId });

        if (!deletedCommunity) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.status(200).json({ message: 'Community deleted', community: deletedCommunity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCommunityById = async (req, res) => {
    const communityId = req.body.groupId;
    const community = await communityModel.findOne({ communityId: communityId });
    res.status(200).json({ community: community });
}
export const getAllCommunities = async (req, res) => {
    const community = await communityModel.find();
    res.status(200).json({ communities: community });
}