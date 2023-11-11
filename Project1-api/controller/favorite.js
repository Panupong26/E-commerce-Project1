const db = require('../models');

const createFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const sellerId = req.body.sellerId;
    
        if(!sellerId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        if(status === 'user') {
            await db.favorite.create({
                userId: userId,
                sellerId: sellerId
            });
                
            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}


const deleteFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const { sellerId } = req.params;
    
        if(!sellerId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        if(status === 'user') {
           await db.favorite.destroy({
            where: {
                userId: userId, 
                sellerId: sellerId
            }});
                
            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}

module.exports = {
    createFavorite,
    deleteFavorite
}
