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
router.post('/createmultiorders', authentication, order.createMultiOrders);
router.get('/getallorder', authentication, order.getAllOrder);
router.get('/getorderbysellerid', authentication, order.getOrderBySellerId);
router.get('/getorderbyuserid', authentication, order.getOrderByUserId);
router.put('/sellercancleorder', authentication, order.sellerCancleOrder);
router.put('/usercancleorder', authentication, order.userCancleOrder);
router.put('/sellerupdateorder', authentication, order.sellerUpdateOrder);
router.put('/userupdateorder', authentication, order.userUpdateOrder);
router.delete('/deleteorder', authentication, order.deleteOrder);

module.exports = router;