
const express = require('express');
const router = express.Router();
const verify = require('../controller/verify');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/getverifystatus', verify.getVerifyStatus);

module.exports = router;