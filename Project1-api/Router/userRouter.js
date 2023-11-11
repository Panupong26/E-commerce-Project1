const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const passport = require('passport');
const { session } = require('passport');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload/userprofilepic');
    },
    filename: function (req, file, cb) {
        const name = req.user.id + '_profilePicture' + '.' + file.mimetype.split('/')[1];
        cb(null, name);
    }
});
const upload = multer({ storage })

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createverification', user.createVerification);
router.post('/createuser', user.createUser);
router.post('/login', user.login);
router.get('/getmydata', authentication, user.getMyData);
router.put('/updatedata', authentication, upload.single('userPicFile'), user.updateUserData);
router.post('/usercreatereset', authentication, user.userCreateReset);
router.post('/guestcreatereset', user.guestCreateReset);
router.patch('/userreset', user.userReset);
router.delete('/deleteuser', authentication, user.deleteUser);




module.exports = router;