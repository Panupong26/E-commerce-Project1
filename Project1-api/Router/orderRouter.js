const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const order = require('../controller/order');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/createorder', authentication, order.createOrder);
router.get('/getallorder', authentication, order.getAllOrder);
router.get('/getorderbysellerid', authentication, order.getOrderBySellerId);
router.get('/getorderbyuserid', authentication, order.getOrderByUserId);
router.patch('/sellercancleorder', authentication, order.sellerCancleOrder);
router.patch('/usercancleorder', authentication, order.userCancleOrder);
router.patch('/sellerupdateorder', authentication, order.sellerUpdateOrder);
router.patch('/userupdateorder', authentication, order.userUpdateOrder);
router.patch('/adminupdateorder', authentication, order.adminUpdateOrder);
router.patch('/refundorder', authentication, order.refundOrder);

module.exports = router;