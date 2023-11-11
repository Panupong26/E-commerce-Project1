const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const shippingOption = require('../controller/shippingOption');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createshippingoption', authentication, shippingOption.createShippingOption);
router.patch('/updateshippingoption', authentication, shippingOption.editShippingOption);
router.delete('/deleteshippingoption/:optionId', authentication, shippingOption.deleteShippingOption);

module.exports = router;