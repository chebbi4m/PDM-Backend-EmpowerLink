import Opportunite from '../models/OpportuniteModel.js';
import mongoose from 'mongoose';
import sendEmail from "../utils/sendEmail.js";
export const getOpportunite = (req, res) => {
  Opportunite.find()
    .then(opportunite => {
      res.json(opportunite);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

export const createOpportunite = (req, res) => {
  const newOpportunite = new Opportunite(req.body);
  newOpportunite.save()
    .then(opportunite => {
      res.status(201).json(opportunite);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

export const deleteOpportunite = (req, res) => {
  const opportuniteId = req.params.id;

  Opportunite.findByIdAndRemove(opportuniteId)
    .then(deletedOpportunite => {
      if (!deletedOpportunite) {
        res.status(404).json({ message: 'Opportunite not found' });
      } else {
        res.json({ message: 'Opportunite deleted successfully' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

export const updateOpportunite = (req, res) => {
  const opportuniteId = req.params.id;

  Opportunite.findByIdAndUpdate(opportuniteId, req.body, { new: true })
    .then(updatedOpportunite => {
      if (!updatedOpportunite) {
        res.status(404).json({ message: 'Opportunite not found' });
      } else {
        res.json(updatedOpportunite);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
export const getOpportuniteById = (req, res) => {
  const opportuniteId = req.params.id;

  Opportunite.findById(opportuniteId)
    .then(opportunite => {
      if (!opportunite) {
        res.status(404).json({ message: 'Opportunite not found' });
      } else {
        res.json(opportunite);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
  /*export const applyToOpportunity = async (req, res) => {
    const opportunityId = req.body.opportunityId;
    const userId = req.body.userId;

    try {
      // Find the opportunity by ID
      const opportunity = await Opportunite.findById(opportunityId);

      if (!opportunity) {
        return res.status(404).json({ message: 'Opportunity not found' });
      }

      // Check if the user ID is already in the applicants array
      if (opportunity.applicants.includes(userId)) {
        return res.status(400).json({ message: 'User already applied to this opportunity' });
      }

      // Add the user ID to the applicants array
      opportunity.applicants.push(userId);

      // Save the updated opportunity
      await opportunity.save();

      return res.status(200).json({ message: 'Application submitted successfully', opportunity });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  */
  export const applyToOpportunity = async (req, res) => {
    const opportunityId = req.body.opportunityId;
    const userId = req.body.userId;
    
  
    try {
      // Find the opportunity by ID
      const opportunity = await Opportunite.findById(opportunityId);
  
      if (!opportunity) {
        return res.status(404).json({ message: 'Opportunity not found' });
      }
  
      // Check if the user ID is already in the applicants array
      if (opportunity.applicants.includes(userId)) {
        return res.status(400).json({ message: 'User already applied to this opportunity' });
      }
  
      // Add the user ID to the applicants array
      opportunity.applicants.push(userId);
  
      // Save the updated opportunity
      await opportunity.save();
  
      // Get the user's email (replace this with your actual way of retrieving user email)
      const userEmail = "wassim.nsiri@esprit.tn"; // replace with the user's email
  
      // Customize the email content
      const emailSubject = "Application Submitted Successfully";
      const emailBody = `
        Dear User,\n\n
        Your application for the opportunity has been submitted successfully.\n
        Opportunity Details:\n
        Title: ${opportunity.title}\n
        Description: ${opportunity.description}\n
        \nThank you for applying!\n\nBest Regards,\nThe Opportunity Team
      `;
  
      // Send the email
      await sendEmail(userEmail, emailSubject, emailBody);
  
      return res.status(200).json({ message: 'Application submitted successfully', opportunity });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
const OpportuniteController = {
  getOpportunite,
  createOpportunite,
  deleteOpportunite,
  updateOpportunite,
  getOpportuniteById,
  applyToOpportunity
};

// Named export for default export

export default OpportuniteController;
