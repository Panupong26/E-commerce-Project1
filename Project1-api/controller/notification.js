const db = require('../models');
const sequelize = require("sequelize")
const Op = sequelize.Op;

const getNotificationByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
    
        if(status === 'user'){
            const targetNotification = await db.notification.findAll({
                where: {userId: userId}
            });
                
            return res.status(200).send(targetNotification);
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}

const getNotificationBySellerId = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;

        if(status === 'seller'){
            const targetNotification = await db.notification.findAll({
                where: {sellerId: sellerId}
            });
            
            return res.status(200).send(targetNotification);
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        if(!notificationId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        await db.notification.destroy({where: {id: notificationId}});
        
        return res.status(200).send({message: 'Done'});

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}

const deleteAllNotification = async (req, res) => {
    try {
        const userId = req.user.id;

    
        await db.notification.destroy({
            where: {
                [Op.or]: [
                    {userId: userId},
                    {sellerId: userId}
                ]
            }
        })
        
        return res.status(200).send({message: 'Done'});

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}

module.exports = {
    getNotificationByUserId,
    getNotificationBySellerId,
    deleteNotification,
    deleteAllNotification
}