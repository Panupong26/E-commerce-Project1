const db = require('../models');
const fs = require('fs');
const { productValidator } = require('../validator/validator');
const findFileByName = require('../findFile/findFileByName');


const createProductOption = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const productId = req.body.productId;
        const optionName = req.body.optionName;
        const price = req.body.price;

        const err = productValidator(price, '', '');

        if(!productId || !optionName || !price || err.optionPrice ) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetProduct = await db.product.findOne({where: {id: productId}});
        
        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId ) {
            await db.productOption.create({
                optionName: optionName,
                price: price,
                productId: productId
            }).then(data => {
                return res.status(201).send(data); 
            })     
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
}


const updateOption = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const optionId = req.body.id;
        const price = req.body.price;
        const outOfStock = req.body.outOfStock;

        if(!optionId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetOption = await db.productOption.findOne({where: {id: optionId}});
        const targetProduct = await db.product.findOne({where: {id: targetOption.productId}});

        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId) {
            
            if(price) {
                await db.productOption.update({
                    price: price,
                    outOfStock: outOfStock
                },
                {
                    where: {id: optionId}
                });
            }            
            return res.status(201).send({message: 'Done'});
            
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
}

const deleteProductOption = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const optionId = req.body.optionId;

        if(!optionId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetPic = await db.optionPicture.findAll({where: {optionId: optionId}});
        const targetOption = await db.productOption.findOne({where: {id: optionId}});
        const targetProduct = await db.product.findOne({where: {id: targetOption.productId}});

        if(targetOption.length === 1) {
            return res.status(400).send({message: 'There should be at least one product option.'})
        }

        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId) {

            for (let e of targetPic) {
                const found = await findFileByName('Upload/optionpic/', e.picture);
                if(found) {
                    fs.unlinkSync(`Upload/optionpic/${e.picture}`);
                }
               
                await db.optionPicture.destroy({where: {id: e.id}});  
            };
            
            await db.productOption.destroy({where: {id: optionId}});
            await db.cart.destroy({where: {productOption: targetOption.optionName, productId: targetOption.productId}});
            
            return res.status(200).send({message: 'Deleted'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
}

const addOptionPic = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const optionId = req.body.optionId;
        const optionPicture = req.files;

        if(!optionId || !optionPicture) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetOption = await db.productOption.findOne({where: {id: optionId}});
        const targetProduct = await db.product.findOne({where: {id: targetOption.productId}});
    
        if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId) {
            for(let el of optionPicture) {
                await db.optionPicture.create({
                    picture: el.filename,
                    optionId: optionId
                }) 
            }  
            return res.status(201).send({message: 'Done'});  
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err?.message)
    }
}

const editOptionPic = async (req, res) => {
    try {
        const pictureId = JSON.parse(req.body.idArr);
        const file = req.files;

        if(!pictureId || !file) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        for(let el of pictureId) {
            const targetPic = await db.optionPicture.findOne({where: {id: el}});
            const index = pictureId.findIndex(e => e === el);
            
            const found = await findFileByName('Upload/optionpic/', targetPic.picture);
            if(found) {
                fs.unlinkSync(`Upload/optionpic/${targetPic.picture}`);
            }

            await db.optionPicture.update({
                picture: file[index].filename
            },
            {
                where: {id: el}
            })
        }
        return res.status(200).send({message: 'Done!'});

    } catch (err) {
        console.log(err);
        return res.status(500).send(err?.message)
    }
}


const deleteOptionPic = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const deleteArr = req.body.deleteArr;

        if(!deleteArr) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        for(let el of deleteArr) {
            const targetPic = await db.optionPicture.findOne({where: {id: el}});
            const targetOption = await db.productOption.findOne({where: {id: targetPic.optionId}});
            const targetProduct = await db.product.findOne({where: {id: targetOption.productId}});
            
            if(status === 'seller' && targetProduct && targetProduct.sellerId === sellerId) { 
                const found = await findFileByName('Upload/optionpic/', targetPic.picture);
                if(found) {
                    fs.unlinkSync(`Upload/optionpic/${targetPic.picture}`);
                }
                
                await db.optionPicture.destroy({
                    where: {id: el}
                });
            } else {
                return res.status(403).send({message: "You don't have permission to access"});
            } 
        }
    
        return res.status(200).send({message: 'Done'});

    } catch (err) {
        return res.status(500).send(err.message);
    }
}



module.exports = {
    createProductOption,
    updateOption,
    deleteProductOption,
    addOptionPic,
    editOptionPic,
    deleteOptionPic,
}