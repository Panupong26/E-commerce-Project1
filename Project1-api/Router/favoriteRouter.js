const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const favorite = require('../controller/favorite');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createfavorite', authentication, favorite.createFavorite);
router.delete('/deletefavorite/:sellerId', authentication, favorite.deleteFavorite);

module.exports = router;