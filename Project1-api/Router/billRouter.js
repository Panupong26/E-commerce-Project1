const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const bill = require('../controller/bill');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.get('/getallbill', authentication, bill.getAllBill);
router.get('/getbillbysellerid', authentication, bill.getBillBySellerId);
router.put('/adminupdatebill', authentication, bill.adminUpdateBill);
router.put('/sellerupdatebill', authentication, bill.sellerUpdateBill);

module.exports = router;