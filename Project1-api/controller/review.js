const db = require('../models');

const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const productId = req.body.productId;
        const orderId = req.body.orderId;
        const reviewMessage = req.body.reviewMessage || '';
        const reviewStar = req.body.reviewStar;
        const time = new Date();
    
        if(!productId || !orderId || !reviewStar) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetOrder = await db.review.findOne({where: {orderId: orderId}});
    
        if(status === 'user') {
            if(!targetOrder) {
                await db.review.create({
                    userId: userId,
                    productId: productId,
                    reviewMessage: reviewMessage,
                    reviewStar: reviewStar,
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                });    
                return res.status(200).send({message: 'Done'});   
            } else {
                return res.status(400).send({message: 'This order has been reviwed'});
            }
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};


module.exports = {
    createReview,
}