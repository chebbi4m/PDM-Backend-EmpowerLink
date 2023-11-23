import express from 'express';
import passport from 'passport';
import upload from '../middlewares/multer-config.js'
import { body } from 'express-validator';
import { registerUser,loginUser } from '../controllers/AuthController.js';
import {  editProfile,getAllUsers ,sendPasswordResetCode,changePassword,
    verifyResetCode,followUser, addSkills,getSkills,searchUsersByName,
    updateProfilePhoto,getUserByName,countFollowers,countFollowing} from '../controllers/user.js';
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
    '/editprofile', editProfile);
router.get('/getuser',getAllUsers);


router.post('/ForgetPassword', sendPasswordResetCode);


router.get('/profile', checkBanned, (req, res) => {
    res.send('User Profile');
});


router.post('/:username/ban', banUser,ban);


router.get('/checkBanned', checkBanned);

router.post('/resetcode', verifyResetCode);

router.post('/changerpassword', changePassword);

router.post('/users/follow', followUser);

router.post("/addskills", addSkills)

router.get('/skills/:userId', getSkills);

router.get('/get/:username', getUserByName);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/search', searchUsersByName);

router.post('/updateprofilephoto/:userId', upload.single('profilePhoto'), updateProfilePhoto);
// Ajoutez cette route pour la redirection après l'authentification Google

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Redirigez l'utilisateur après une authentification réussie
  res.redirect('/dashboard'); // Changez ceci avec votre propre redirection
});
router.get('/countFollowers/:userId', countFollowers);
router.get('/countFollowing/:userId', countFollowing);
export default router;
