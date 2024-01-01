import express from 'express';
import passport from 'passport';
import upload from '../middlewares/multer-config.js'
import { body } from 'express-validator';
import { registerUser,loginUser,signInWithGoogle,verifyUserWithGoogle,getCurrentUser } from '../controllers/AuthController.js';
import {  editProfile,getAllUsers ,sendPasswordResetCode,changePassword,
    verifyResetCode,followUser, addSkills,getSkills,searchUsersByName,
    updateProfilePhoto,getUserByName,countFollowers,countFollowing , unfollowUser , resetPassword2,checkFollowStatus ,getFollowers,getfollowing} from '../controllers/user.js';
import { banUser, ban, checkBanned , deleteAccount} from '../controllers/ban.js';


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

router.get('/getfollowers/:userId' , getFollowers);
router.get('/getfollowing/:userId' , getfollowing);
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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/search', searchUsersByName);

router.get('/getCurrentUser',getCurrentUser);


router.post('/updateprofilephoto/:userId' , upload.single('profilePhoto'), updateProfilePhoto);
// Ajoutez cette route pour la redirection après l'authentification Google

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/login' }),
signInWithGoogle

);
router.post('/verifygoogle',verifyUserWithGoogle);
router.get('/countFollowers/:userId', countFollowers);
router.get('/countFollowing/:userId', countFollowing);

router.delete('/delete/:username', deleteAccount);
router.post('/unfollow', unfollowUser);
router.post('/pass', resetPassword2);

router.post('/checkFollowStatus', checkFollowStatus);

export default router;
