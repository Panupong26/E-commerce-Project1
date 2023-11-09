const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');
const db = require('../models');
require('dotenv').config();

const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

const jwtStrategy = new Strategy(option, async (payload, done) => {
    const status = payload.status;

    if(status === 'seller') {
        let targetUser = await db.seller.findOne({where: {id: payload.id}});
        if(targetUser) {
            targetUser.status = status;
            done(null, targetUser);
        } else {
            done(null, false);
        }
    } else if(status === 'user') {
        let targetUser = await db.user.findOne({where: {id: payload.id}});
        if(targetUser) {
            targetUser.status = status;
            done(null, targetUser);
        } else {
            done(null, false);
        }
    } else if(status === 'admin') {
        let targetAdmin = await db.admin.findOne({where: {username: payload.username}})
        if(targetAdmin) {
            targetAdmin.status = status;
            done(null, targetAdmin);
        } else {
            done(null, false);
        };
    };
});

passport.use('Jwt', jwtStrategy);
