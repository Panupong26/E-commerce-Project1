
const express = require('express');
const router = express.Router();
const reset = require('../controller/reset');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/getrefdata', reset.getRefData);

module.exports = router;