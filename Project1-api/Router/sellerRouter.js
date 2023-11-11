const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const seller = require('../controller/seller');
const passport = require('passport');
const { session } = require('passport');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload/sellerprofilepic');
    },
    filename: function (req, file, cb) {
        const name = req.user.id + '_storePicture' + '.' + file.mimetype.split('/')[1];
        cb(null, name);
    }
});
const upload = multer({ storage });

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createverification', seller.createVerification);
router.post('/createseller', seller.createSeller);
router.post('/login', seller.login);
router.get('/getmydata', authentication, seller.getMyData);
router.get('/getshopdatabyadmin/:sellerId', authentication, seller.adminGetShopData);
router.get('/getshopdata/:shopId',  seller.getShopData);
router.get('/getshopdatabyname/:shopName', seller.getShopDataByName);
router.get('/getallshopdata',  seller.getAllShopData);
router.put('/updatedata', authentication, upload.single('storePicture'), seller.updateShopData);
router.post('/sellercreatereset', authentication, seller.sellerCreateReset);
router.post('/guestcreatereset', seller.guestCreateReset);
router.patch('/sellerreset', seller.sellerReset);
router.delete('/deleteseller', authentication, seller.deleteSeller);


module.exports = router;
