import UserModel from "../models/user.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { validationResult, check } from 'express-validator';

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
export const followUser = async (req, res) => {
  const { UserId } = req.body; // Utilisez targetUserId pour éviter toute confusion avec le paramètre d'URL
  const { _id } = req.user; // Utilisez req.user pour obtenir l'ID de l'utilisateur actuel

  if (targetUserId === _id) {
    return res.status(403).json("Action Forbidden");
  }

  try {
    const targetUser = await UserModel.findById(UserId);
    const currentUser = await UserModel.findById(_id);

    if (!targetUser.followers.includes(_id)) {
      await targetUser.updateOne({ $push: { followers: _id } });
      await currentUser.updateOne({ $push: { following: UserId } });
      res.status(200).json("User followed!");
    } else {
      res.status(403).json("You are already following this user");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const unfollowUser = async (req, res) => {
  const { targetUserId } = req.body; // Utilisez targetUserId pour éviter toute confusion avec le paramètre d'URL
  const { _id } = req.user; // Utilisez req.user pour obtenir l'ID de l'utilisateur actuel

  if (targetUserId === _id) {
    return res.status(403).json("Action Forbidden");
  }

  try {
    const targetUser = await UserModel.findById(targetUserId);
    const currentUser = await UserModel.findById(_id);

    if (targetUser.followers.includes(_id)) {
      await targetUser.updateOne({ $pull: { followers: _id } });
      await currentUser.updateOne({ $pull: { following: targetUserId } });
      res.status(200).json("Unfollowed successfully!");
    } else {
      res.status(403).json("You are not following this user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
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