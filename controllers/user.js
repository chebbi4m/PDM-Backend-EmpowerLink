import UserModel from "../models/user.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { validationResult, check } from 'express-validator';
import { MIME_TYPES } from "../middlewares/multer-config.js";

import sendEmail from "../utils/sendEmail.js";
  
export const editProfile = async (req, res) => {
    const userId = req.body.userId; // Assuming the user ID is passed in the request body
    const { username, email, firstname, lastname, address, birthday, number,description } = req.body;

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await UserModel.findById(userId); // Change here to use userId from the request body

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Mise à jour des champs du profil
        user.username = username || user.username;
        user.email = email || user.email;
        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.adress = address || user.adress;
        user.birthday = birthday || user.birthday;
        user.number = number || user.number;
        user.description = description || user.description;
        if (req.file) {
          user.image = req.file.path; // Save the file path or any identifier in your database
      }

        // Sauvegarde des modifications
        const updatedUser = await user.save();

        res.status(200).json({ user: updatedUser, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getAllUsers = async (req, res) => {
    try {
      let users = await UserModel.find();
      users = users.map((user) => {
        const { password, adress, ...otherDetails } = user._doc;
        return otherDetails;
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
/*
  export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };*/
 


  export const sendPasswordResetCode = async (req, res) => {


   
    try {
      const  email  = req.body.email;
      const user = await UserModel.findOne({ email:email });
  
      if (!user) {
        return res.json({ error: 'User not found' });
      }
     console.log(email);
  
      const resetCode = generateRandomNumericCode(4);
      user.restcode = resetCode;
      await user.save();
  
    sendEmail(email,"Reset Code",resetCode);
    res.status(200).json("Mail sent !");
    console.log(sendEmail);
    } catch (error) {
      console.error(error);
      res.json({ error: 'An error occurred' });
    }
  };
  function generateRandomNumericCode(length) {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10); // Ajoute un chiffre aléatoire à la chaîne
    }
    return code;
}
  export const verifyResetCode = async (req, res) => {
    try {
      const email = req.body.email;
      const resetCode = req.body.resetCode;
  
      const user = await UserModel.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (user.restcode !== resetCode) {
        return res.status(400).json({ error: 'Invalid reset code' });
      }
  
      res.status(200).json({ message: 'Reset code verified successfully', userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
 export const searchUsersByName = async (req, res) => {
    const searchName = req.query.name; // Use req.query to get query parameters

    try {
        const users = await UserModel.find({
            $or: [
                { username: { $regex: searchName, $options: 'i' } },
                { firstname: { $regex: searchName, $options: 'i' } },
                { lastname: { $regex: searchName, $options: 'i' } },
            ],
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found with the given name' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



  export const changePassword = async (req, res) => {
    try {
      const userEmail = req.body.email; // Change userId to userEmail
      const newPassword = req.body.password;
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      const user = await UserModel.findOne({ email: userEmail }); // Use findOne with email
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Mettre à jour le mot de passe pour l'utilisateur avec le nouveau mot de passe hashé
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  // Fonction pour vérifier le type MIME valide
const isValidMimeType = (mimeType) => {
  // Logique de validation du type MIME, par exemple en utilisant la bibliothèque `mime-types`
  // ...
  return true; // ou false en fonction du résultat de la validation
};

// Fonction pour supprimer une image du disque
const deleteOldImage = (imagePath) => {
  // Logique pour supprimer l'image du disque
  // ...
};

export const updateProfilePhoto = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
      const user = await UserModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Gestion du téléchargement de la photo de profil
      if (req.file) {
          const imagePath = req.file.path;

          // Vérifier si le fichier est une image avec un type MIME valide
          const mimeType = req.file.mimetype;
          if (!isValidMimeType(mimeType)) {
              return res.status(400).json({ message: 'Invalid file type' });
          }

          // Supprimer l'ancienne image du disque si elle existe
          if (user.image) {
              deleteOldImage(user.image);
          }

          // Vous pouvez stocker le chemin de fichier ou un identifiant dans votre base de données
          user.image = imagePath;
          const updatedUser = await user.save();
          return res.status(200).json({ user: updatedUser, message: 'Profile photo updated successfully' });
      } else {
          return res.status(400).json({ message: 'No file uploaded' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};











  /*export const changepassword =async(req,res)=>{

    try {
      const id = req.params;
      const salt = await bcrypt.genSalt(10);
      const password = req.body.password
      const hashedPassword = await bcrypt.hash(password, salt);
      const randomCode = req.body.resetCode;
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
      if (user.restcode !== randomCode) {
        return res.status(400).json({ message: "Invalid reset code" });
      }
      const editProfile = { password: hashedPassword , resetCode: null};
      await UserModel.findOneAndUpdate({_id: id}, editProfile); 
       res.status(200).json({message: "Password reset successfully"});
  }catch(error){
    console.log(error);
    res.status(400).json({ error });
  }
  };*/

 // userController.js
 



export const addSkills = async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is passed in the request body
  const { skills } = req.body;

  try {
      // Validate the skills input if needed
      // For example, you can use express-validator for this purpose
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }

      // Find the user in the database
      const user = await UserModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Add skills to the user's profile
      user.skills = user.skills.concat(skills);

      // Save the updated user profile
      const updatedUser = await user.save();

      res.status(200).json({ user: updatedUser, message: 'Skills added successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
};
export const getSkills = async (req, res) => {
  const userId = req.params.userId; // Assuming the user ID is passed in the request parameters

  try {
    // Find the user in the database
    const user = await UserModel.findById(userId);
    console.log('Received request for user ID:', userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the skills of the user
    res.status(200).json({ skills: user.skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserByName = async (req, res) => {
  const username = req.params.username; // Assuming the username is passed in the request parameters

  try {
    // Find the user in the database by username
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const followUser = async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is passed in the request body
  const targetUsername = req.body.username;

  try {
    // Find the user who wants to follow
    const followerUser = await UserModel.findById(userId);
    if (!followerUser) {
      return res.status(404).json({ message: 'Follower user not found' });
    }

    // Find the user to be followed
    const targetUser = await UserModel.findOne({ username: targetUsername });
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if the user is already following the target user
    if (followerUser.following.includes(targetUser._id)) {
      return res.status(400).json({ message: 'User is already following the target user' });
    }

    // Update the follower user's following list
    followerUser.following.push(targetUser._id);
    await followerUser.save();

    // Update the target user's followers list
    targetUser.followers.push(userId);
    await targetUser.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const countFollowers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = user.followers.length;
    res.status(200).json({ followersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const countFollowing = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followingCount = user.following.length;
    res.status(200).json({ followingCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

