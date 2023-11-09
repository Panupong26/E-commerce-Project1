const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const productOption = require('../controller/productOption');
const passport = require('passport');
const { session } = require('passport');
const multer = require('multer');
const fs = require("fs")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload/optionpic');
    },
    filename: function (req, file, cb) {
        const name = 'o' + req.user.id + new Date().getTime() + Math.random() + '.' + file.mimetype.split('/')[1];
        cb(null, name);
    }
});
const upload = multer({ storage });


const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createproductoption', authentication, productOption.createProductOption);
router.post('/getproductoptionbyoptionid', productOption.getProductOptionByOptionId);
router.post('/getproductoptionbyproductid', productOption.getProductOptionByProductId);
router.patch('/updateprice', authentication, productOption.updatePrice);
router.delete('/deleteproductoption', authentication, productOption.deleteProductOption);
router.post('/addpicture', authentication, upload.any('optionPicture'), productOption.addOptionPic);   
router.post('/editpicture', authentication, upload.any('optionPicture'), productOption.editOptionPic);
router.delete('/deletepicture', authentication, productOption.deleteOptionPic);

module.exports = router;