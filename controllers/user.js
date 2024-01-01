import UserModel from "../models/user.js";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { validationResult, check } from 'express-validator';
import { MIME_TYPES } from "../middlewares/multer-config.js";
import mongoose from 'mongoose';

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
 


  function generateResetCodeEmail(resetCode) {
    const emailSubject = 'Password Reset Code';
    const emailBody = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title></title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    </head>
    
    <body>
        <div dir="ltr" class="es-wrapper-color">
            <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#fafafa"></v:fill>
          </v:background>
        <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <table cellpadding="0" cellspacing="0" class="es-content esd-header-popover es-mobile-hidden" align="center">
                                <tbody>
                                    <tr>
                                        <td class="es-adaptive esd-stripe" align="center" esd-custom-block-id="88589">
                                            <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p10" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="580" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://demo.stripocdn.email/content/guids/7e8aaa2a-caa7-4174-82e4-5b64f175339d/images/logo.png" alt style="display: block;" width="317"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="es-infoblock esd-block-text">
                                                                                            <p>Put your preheader text here. <a href="https://viewstripo.email" class="view" target="_blank">View in browser</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center">
                                            <table class="es-content-body" style="background-color: #ffffff;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p40t es-p20r es-p20l" style="background-color: transparent; background-position: left top;" bgcolor="transparent" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table style="background-position: left top;" width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image es-p5t es-p5b" align="center" style="font-size:0"><a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display: block;" width="175"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p15t es-p15b" align="center">
                                                                                            <h1 style="color: #333333; font-size: 20px;"><strong>FORGOT YOUR </strong></h1>
                                                                                            <h1 style="color: #333333; font-size: 20px;"><strong>&nbsp;PASSWORD?</strong></h1>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p40r es-p40l" align="center">
                                                                                            <p><br></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p35r es-p40l" align="left">
                                                                                            <p style="text-align: center;">There was a request to change your password!</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p25t es-p40r es-p40l" align="center">
                                                                                            <p>If did not make this request, just ignore this email. Otherwise, please click the button below to change your password:</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                    <td class="esd-block-button es-p40t es-p40b es-p10r es-p10l" align="center">
                                                                                        <span class="es-button-border">
                                                                                            <a href="https://viewstripo.email/" class="es-button" target="_blank">
                                                                                                <strong>${resetCode}</strong>
                                                                                            </a>
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-position: left top;" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text" esd-links-color="#666666" align="center">
                                                                                            <p style="font-size: 14px;">Contact us: +21693260059 | empowerLink<a target="_blank" href="mailto:your@mail.com" style="font-size: 14px; color: #666666;">@esprit.</a>tn</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-footer" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center">
                                            <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p10t es-p30b es-p20r es-p20l" style=" background-color: #0b5394; background-position: left top;" bgcolor="#0b5394" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text es-p5t es-p5b" align="left">
                                                                                            <h2 style="font-size: 16px; color: #ffffff;"><strong>Have quastions?</strong></h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td esd-links-underline="none" esd-links-color="#ffffff" class="esd-block-text es-p5b" align="left">
                                                                                            <p style="font-size: 14px; color: #ffffff;">We are here to help, learn more about us <a target="_blank" style="font-size: 14px; color: #ffffff; text-decoration: none;">here</a></p>
                                                                                            <p style="font-size: 14px; color: #ffffff;">or <a target="_blank" style="font-size: 14px; text-decoration: none; color: #ffffff;">contact us</a><br></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center">
                                            <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p15t" style="background-position: left top;" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-menu">
                                                                                            <table class="es-menu" width="100%" cellspacing="0" cellpadding="0">
                                                                                                <tbody>
                                                                                                    <tr class="links">
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l" style="padding-bottom: 1px; padding-top: 0px; " width="33.33%" valign="top" bgcolor="transparent" align="center"><a target="_blank" href="https://viewstripo.email" style="color: #3D5CA3; font-size: 14px;">Sing up</a></td>
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l" style="border-left: 1px solid #3d5ca3; padding-bottom: 1px; padding-top: 0px; " width="33.33%" valign="top" bgcolor="transparent" align="center"><a target="_blank" href="https://viewstripo.email" style="color: #3D5CA3; font-size: 14px;">Blog</a></td>
                                                                                                        <td class="es-p10t es-p10b es-p5r es-p5l" style="border-left: 1px solid #3d5ca3; padding-bottom: 1px; padding-top: 0px; " width="33.33%" valign="top" bgcolor="transparent" align="center"><a target="_blank" href="https://viewstripo.email" style="color: #3D5CA3; font-size: 14px;">About us</a></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-spacer es-p20b es-p20r es-p20l" align="center" style="font-size:0">
                                                                                            <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="border-bottom: 1px solid #fafafa; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-footer" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center" esd-custom-block-id="88330">
                                            <table class="es-footer-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p15t es-p5b es-p20r es-p20l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td esd-links-underline="underline" align="center" class="esd-block-text">
                                                                                            <p style="font-size: 12px; color: #666666;">This daily newsletter was sent to info@name.com from company name because you subscribed. If you would not like to receive this email <a target="_blank" style="font-size: 12px; text-decoration: underline;" class="unsubscribe">unsubscribe here</a>.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content esd-footer-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" esd-custom-block-id="42537" align="center">
                                            <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-empty-container" style="display: none;"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>
      
      `;
    
      return {
        subject: emailSubject,
        body: emailBody,
      };
  };
  
  export const sendPasswordResetCode = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await UserModel.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });

      }
  
      const resetCode = generateRandomNumericCode(4);
      user.restcode = resetCode;
      await user.save();
  
      const emailContent = generateResetCodeEmail(resetCode);
sendEmail(email, emailContent.subject, emailContent.body, emailContent.html);

  
      res.status(200).json("Mail sent!");
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
  //  print(followersCount)
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
export const getfollowing = async (req, res) => {
    const userId = req.params.userId;
   // print(followersCount)
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const followerIds = user.following;
      const followers = await UserModel.find({ _id: { $in: followerIds } }, 'username');
      res.status(200).json({ followers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  export const getFollowers = async (req, res) => {
    let userId = req.params.userId;
    userId = userId.trim(); // Trim leading and trailing spaces
  
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const followerIds = user.followers;
      const followers = await UserModel.find({ _id: { $in: followerIds } }, 'username');
      res.status(200).json({ followers });
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

export const unfollowUser = async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is passed in the request body
  const targetUsername = req.body.username;

  try {
    // Find the user who wants to unfollow
    const unfollowerUser = await UserModel.findById(userId);
    if (!unfollowerUser) {
      return res.status(404).json({ message: 'Unfollower user not found' });
    }

    // Find the user to be unfollowed
    const targetUser = await UserModel.findOne({ username: targetUsername });
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if the user is currently following the target user
    if (!unfollowerUser.following.includes(targetUser._id)) {
      return res.status(400).json({ message: 'User is not following the target user' });
    }

    // Remove the target user from the unfollower user's following list
    unfollowerUser.following = unfollowerUser.following.filter(followedUserId => followedUserId.toString() !== targetUser._id.toString());
    await unfollowerUser.save();

    // Remove the unfollower user from the target user's followers list
    targetUser.followers = targetUser.followers.filter(followerUserId => followerUserId.toString() !== userId.toString());
    await targetUser.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const resetPassword2 = async (req, res) => {
    try {
      const email = req.body.email;
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
  
      // Find the user by email
      const user = await User.findOne({ email: email });
  
      // Check if the user exists
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
  
      // Check if the old password is valid
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json("Invalid old password" );
      }
  
      // Generate salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      const updatedUser = { password: hashedPassword, passwordResetToken: null };
      await User.findOneAndUpdate({ email: email }, updatedUser);
  
      res.status(200).json("Password changed successfully");
    } catch (error) {
      res.status(400).json(error.message);
    }
  };
  export const checkFollowStatus = async (req, res) => {
    const userId = req.body.userId; // Assuming the user ID is passed in the request body
    const targetUsername = req.body.username;
  
    try {
      // Find the user who wants to check follow status
      const checkingUser = await UserModel.findById(userId);
      if (!checkingUser) {
        return res.status(404).json({ message: 'Checking user not found' });
      }
  
      // Find the user to be checked for follow status
      const targetUser = await UserModel.findOne({ username: targetUsername });
      if (!targetUser) {
        return res.status(404).json({ message: 'Target user not found' });
      }
  
      // Check if the user is following the target user
      const isFollowed = checkingUser.following.includes(targetUser._id);
  
      res.status(200).json({ isFollowed });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  