import communityModel from "../models/community.js";
import { validationResult } from 'express-validator';

export const createCommunity = async (req, res) => {
    console.log(req.body.username);

    try {
        const { 
            username,
            name,
            category,
            objectif,
            pinnedMessage
        } = req.body;
        const communityExists = await communityModel.findOne({ name });

        // Check if community name already exists
        console.log("vvvv");
        console.log(req.body.username);
        console.log("vvvv");

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
            image: "no image",
            pinnedMessage,
            communityId, // Add the community ID
            createdAt: new Date(), // Add the current timestamp
            members: [username], // Add the username to the members array
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
    const { communityId, name, image, objectif, category } = req.body;

    try {
        const community = await communityModel.findOne({ communityId: communityId });
        console.log(community);

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        community.name = name || community.name;
        community.image = image || community.image;
        community.objectif = objectif || community.objectif;
        community.category = category || community.category;

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
export const getCommunityByName = async (req, res) => {
    console.log("body", req.body)
    const communityName = req.body.name;
    console.log("name", communityName)
    const community = await communityModel.findOne({ name: communityName });
    res.status(200).json({ community: community });
}
export const getAllCommunities = async (req, res) => {
    const community = await communityModel.find();
    res.status(200).json({ communities: community });
}
export const joinCommunity = async (req, res) => {
    const { username, communityId } = req.body;

    try {
        let community = await communityModel.findOne({ communityId: communityId });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if the 'pending' attribute exists and is an array
        if (!community.pending || !Array.isArray(community.pending)) {
            community.pending = [username]; // Initialize 'pending' as an array with the username
        } else {
            // Check if the username already exists in 'pending', if not, push it into the array
            if (!community.pending.includes(username)) {
                community.pending.push(username);
            }
        }

        // Save the updated community with the 'pending' attribute
        community = await community.save();

        res.status(200).json({ community, message: 'Joined community successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const approveRequest = async (req, res) => {
  try {
    const { username, communityId } = req.body;

    // Find the community by ID
    const community = await communityModel.findOne({ communityId: communityId });

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the username is in the pending list
    const pendingIndex = community.pending.indexOf(username);

    if (pendingIndex === -1) {
      return res.status(400).json({ message: 'Username not found in pending requests' });
    }

    // Remove username from pending
    community.pending.splice(pendingIndex, 1);

    // Add username to members
    community.members.push(username);

    // Save the updated community
    await community.save();

    res.status(200).json({ message: 'Request approved' });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const pinCommunity = async (req, res) => {
    const { username, communityId } = req.body;

    try {
        let community = await communityModel.findOne({ communityId: communityId });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if the 'pinned' attribute exists and is an array
        if (!community.pinned || !Array.isArray(community.pinned)) {
            community.pinned = [username]; // Initialize 'pinned' as an array with the username
        } else {
            // Check if the username already exists in 'pinned', if yes, remove it
            if (community.pinned.includes(username)) {
                community.pinned = community.pinned.filter((user) => user !== username);
            } else {
                // 'pinned' exists, push the username into the array
                community.pinned.push(username);
            }
        }

        // Save the updated community with the 'pinned' attribute
        community = await community.save();

        res.status(200).json({ community, message: 'Pinned community successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserPinnedCommunities = async (req, res) => {
    const communityId = req.body.groupId;
    const community = await communityModel.findOne({ communityId: communityId });
    res.status(200).json({ community: community });
}

export const addCommunityPinnedMessage = async (req, res) => {
    const { communityId, pinnedMessage } = req.body;

    try {
        let community = await communityModel.findOne({ communityId: communityId });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if the 'pinnedMessage' attribute exists and update it
        community.pinnedMessage = pinnedMessage;

        // Save the updated community with the 'pinnedMessage' attribute
        community = await community.save();

        res.status(200).json({ community, message: 'Pinned message added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}