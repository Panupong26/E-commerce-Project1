const db = require('../models');
const { productValidator } = require('../validator/validator');

const createShippingOption = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const productId = req.body.productId;
        const optionName = req.body.optionName;
        const price = req.body.price;
        const quantity = req.body.quantity;
    
        const err = productValidator('', price, quantity);
    
        if(err.sentPrice || err.sentQuantity || !productId || !optionName) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetProduct = await db.product.findOne({where: {id: productId}});
        
        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId ) {
            await db.shippingOption.create({
                optionName: optionName,
                price: price,
                quantity: quantity,
                productId: productId
            })
            .then(data => {
                return res.status(201).send(data); 
            })   
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
}


const editShippingOption = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const optionId = req.body.optionId;
        const price = req.body.price;
        const quantity = req.body.quantity;
    
        const err = productValidator('', price, quantity);
    
        if(err.sentPrice || err.sentQuantity || !optionId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetOption = await db.shippingOption.findOne({where: {id: optionId}});
        const targetProduct = await db.product.findOne({where: {id: targetOption.productId}});
    
        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId) {
            await db.shippingOption.update({
                price: price,
                quantity: quantity
            },
            {
                where: {id: optionId}
            })
            .then(() => {
                targetOption.price = price;
                targetOption.quantity = quantity;
                
                return res.status(200).send(targetOption); 
            })    
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
}

const deleteShippingOption = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const { optionId } = req.params;

        if(!optionId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetOption = await db.shippingOption.findOne({where: {id: optionId}});
        const targetProduct = await db.product.findOne({where: {id: targetOption.productId}});

        if(targetOption.length === 1) {
            return res.status(400).send({message: 'There should be at least one shipping option.'})
        }

        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId ) {
            await db.shippingOption.destroy({
                where: {id: optionId}
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


module.exports = {
    createShippingOption,
    editShippingOption,
    deleteShippingOption
}
