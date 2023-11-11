const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const cart = require('../controller/cart');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createcart', authentication, cart.createCart);
router.get('/getcart', authentication, cart.getCart);
router.delete('/deletecart/:cartId', authentication, cart.deleteCartByCartId);

module.exports = router;