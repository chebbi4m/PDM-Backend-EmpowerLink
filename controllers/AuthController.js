import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import express from 'express';
import session from 'express-session';
import sendEmail from "../utils/sendEmail.js";
import { token } from "morgan";




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


export const getCurrentUser = async (req, res) => {
  try {
      if (!req.header("Authorization")) return res.status(401).json({ message: "Unauthorized" });
      const token = req.header("Authorization").split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decodedToken.userId).select("-password");
      
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);
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
        if (req.user && req.user.googleId) {
            return res.status(200).json({ message: 'Successfully logged in with Google', user: req.user });
          }

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
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                description: user.description,
                image: user.image,
                token:user.JWT_KEY // Ajoutez d'autres informations utilisateur au besoin
            },
            secretKey,
            { expiresIn: '1h' }
        );
    


        
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
};
passport.use(
    new GoogleStrategy(
      {
        clientID: '244005885594-2lau83gs84r77n3lgmlkj3ns2i336kli.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:9090/user/google/callback', // Assurez-vous de le configurer correctement sur la console Google Developer
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Vérifiez si l'utilisateur existe déjà dans la base de données
          let user = await UserModel.findOne({email : profile.emails[0].value});
  
    
          if (user ){
            googleAuthSignin(user,accessToken,refreshToken,profile,done)
          }
      
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  const googleAuthSignin =  async(user,accessToken,refreshToken,profile,done ) =>{
    return done(null,user);
  };
  
  // Sérialisez l'utilisateur dans la session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  // Désérialisez l'utilisateur depuis la session
  passport.deserializeUser(async (id, done) => {
   done (null,user)
  });

 export const signInWithGoogle = async (req, res) => {
    const user = req.user;
    const token = jwt.sign({ userId: user._id , email: user.email }, process.env.JWT_SECRET, { expiresIn: "30m" });
    res.status(200).json({token}); 
 
 };
 export const verifyUserWithGoogle = async (req, res) => {
  const googleIdToken = req.body.googleIdToken;
   try{
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID,
   });
    const payload = ticket.getPayload();
    const email = payload.email;
   
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Please sign up first !" });
    }
    if (user.banned === true) {
      return res.status(400).json({ message: "Your account is banned ! Please contact the support." });
    }
    const token = jwt.sign({ userId: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: "30m" });
    res.status(200).json({token});
}catch (error) {
  res.status(400).json(error.message);
}
}