const db = require('../models');

const createCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const productId = req.body.productId;
        const productName = req.body.productName;
        const productOption = req.body.productOption;
        const shippingOption = req.body.shippingOption;
        const cartPicture = req.body.cartPicture;
        const quantity = req.body.quantity;
        const totalPrice = req.body.totalPrice;
    
        if(!productId || 
           !productName || 
           !productOption || 
           !shippingOption || 
           !cartPicture || 
           !quantity || 
           typeof quantity !== 'number' || 
           !totalPrice || 
           typeof totalPrice !== 'number'
        ) {
            return res.status(400).send({message: 'Invalid request value'});
        }
        
        if(status === 'user') {
            await db.cart.create({
                userId: userId,
                productId: productId,
                productName: productName,
                productOption: productOption,
                shippingOption: shippingOption,
                cartPicture: cartPicture,
                quantity: quantity,
                totalPrice: totalPrice
            });
            
            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}


const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;

        if(status === 'user') {
            const targetCart = await db.cart.findAll({
                where: {userId: userId}
        });

            return res.status(200).send(targetCart);
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    } 
}

const deleteCartByCartId = async (req, res) => {
    const userId = req.user.id;
    const status = req.user.status;
    const { cartId } = req.params;

    const targetCart = await db.cart.findOne({where: {id: cartId}});

    if(status === 'user' && targetCart && targetCart.userId === userId) {
        await db.cart.destroy({
            where: {id: cartId}
        });
        
        return res.status(200).send({message: 'Done'});
    } else {
        return res.status(403).send({message: "You don't have permission to access"});
    }
}


module.exports = {
    createCart,
    getCart,
    deleteCartByCartId
}