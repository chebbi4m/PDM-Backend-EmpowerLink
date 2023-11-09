import UserModel from "../models/user.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

import sendEmail from "../utils/sendEmail.js";

export const editProfile = async (req, res) => {
    const userId = req.params.userId; // Supposons que vous utilisez un paramètre dans l'URL pour identifier l'utilisateur
    const { username, email, firstname, lastname, address ,birthday , number } = req.body;

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await UserModel.findById(userId);

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
  
      const resetCode = nanoid(5).toUpperCase();
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
  export const changepassword =async(res,req)=>{

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
  };