const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const payment = require('../controller/payment');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/create-checkout-session', authentication, payment.createPayment);
router.post('/createorder', payment.createOreder);

module.exports = router;