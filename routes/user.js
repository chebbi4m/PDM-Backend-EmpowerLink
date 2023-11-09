import express from 'express';
import { body } from 'express-validator';
import { registerUser,loginUser } from '../controllers/AuthController.js';
import {  editProfile,getAllUsers ,sendPasswordResetCode,changePassword,verifyResetCode} from '../controllers/user.js';
import { banUser, ban, checkBanned } from '../controllers/ban.js';

const router = express.Router();

// Route pour l'inscription d'un nouvel utilisateur
router.post('/register', [
    body('username').notEmpty().isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], registerUser);

// Route pour la yconnexion de l'utilisateur
router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], loginUser);


router.put(
    '/users/:userId', editProfile);
router.get('/getuser',getAllUsers);


router.post('/ForgetPassword', sendPasswordResetCode);
router.get('/profile', checkBanned, (req, res) => {
    res.send('User Profile');
});
router.post('/:username/ban', banUser,ban);
router.get('/checkBanned', checkBanned);
router.post('/resetcode', verifyResetCode);
router.post('/changerpassword', changePassword);


export default router;
