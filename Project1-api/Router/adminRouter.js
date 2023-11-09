const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');
const passport = require('passport');
const { session } = require('passport');


const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));


router.post('/login', admin.adminLogin);
router.post('/verificationadmin', admin.createAdminVerification);
router.post('/createadmin', admin.createAdmin);
router.get('/getadmin', authentication, admin.getAdmin);
router.get('/admincreatereset', authentication, admin.adminCreateAdminReset);
router.post('/guestcreatereset', admin.guestCreateAdminReset);
router.put('/adminreset', admin.adminReset);
router.delete('/deleteadmin', authentication, admin.deleteAdmin);


module.exports = router;