const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const review = require('../controller/review');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createreview', authentication, review.createReview);

module.exports = router;