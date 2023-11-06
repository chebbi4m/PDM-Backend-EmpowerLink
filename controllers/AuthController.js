import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';
import express from 'express';
import session from 'express-session';
import sendEmail from "../utils/sendEmail.js";




export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création d'un nouvel utilisateur
        const newUser = new UserModel({
            ...req.body,
            password: hashedPassword
        });

        // Enregistrement du nouvel utilisateur
        const user = await newUser.save();
        

        // Création du token JWT
        const token = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_KEY, // Assurez-vous d'avoir JWT_KEY défini dans vos variables d'environnement
            { expiresIn: "1h" }
        );

        // Répondre avec l'utilisateur et le token
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




    

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validation des entrées
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.banned === 'banned' ) {
            return res.status(403).json({ message: 'Your account is banned' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
       
        const secretKey = process.env.JWT_SECRET || 'defaultSecret'; // Utilisez votre propre clé secrète ici
        const token = jwt.sign(
            { username: user.username, email: user.email },
            secretKey
        );
    


        
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
};


