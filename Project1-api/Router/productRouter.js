const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const product = require('../controller/product');
const passport = require('passport');
const { session } = require('passport');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload/productpic');
    },
    filename: function (req, file, cb) {
        const name = 'p' + req.user.id + new Date().getTime() + Math.random() + '.' + file.mimetype.split('/')[1];
        cb(null, name);
    }
});
const upload = multer({ storage });


const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createproduct', authentication, upload.any('productPicture'), product.createProduct);
router.get('/getallproduct', product.getAllProduct);
router.post('/getproductbysellerid', product.getProductBySellerId);
router.post('/getproductbyproductid', product.getProductByProductId);
router.patch('/updateproduct', authentication, product.editProduct);
router.delete('/deleteproduct', authentication, product.deleteProduct);
router.delete('/admindeleteproduct', authentication, product.adminDeleteProduct);

module.exports = router;