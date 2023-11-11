const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const notification = require('../controller/notification');
const passport = require('passport');
const { session } = require('passport');

const authentication = passport.authenticate('Jwt', {session: false});

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.get('/getnotificationbyuserid', authentication, notification.getNotificationByUserId);
router.get('/getnotificationbysellerid', authentication, notification.getNotificationBySellerId);
router.delete('/deletenotification/:notificationId', notification.deleteNotification);


module.exports = router;