const db = require('../models');
const fs = require('fs');
const Sequelize = require('sequelize');const { resolve } = require('path');
const { productValidator } = require('../validator/validator');
const findFileByName = require("../findFile/findFileByName");

const Op = Sequelize.Op;


const createProduct = async (req,res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const input = JSON.parse(req.body.input);
        const productName = input.productName;
        const productType = input.productType;
        const productDetail = input.productDetail;
        const productOption = input.productOption;
        const productOptionPrice = input.productOptionPrice;
        const sentOption = input.sentOption;
        const sentOptionPrice = input.sentOptionPrice;
        const sentAmount = input.sentAmount;
        const pictureFile = req.files;


        const time = new Date();

        const err = productValidator(productOptionPrice, sentOptionPrice, sentAmount);

        if(err || !productName || !productType || !productDetail || !productOption || !sentOption) {
            return res.status(400).send({message: 'Invalid request value'});
        }


        if(status === 'seller') {
            await db.product.create({
                productName: productName,
                productType: productType,
                productDetail: productDetail,
                sellerId: sellerId,
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                productSellCount: 0
            })
            .then(async pdata => {
                
                const a = new Promise(async (resolve, reject) => {
                    for(let el of pictureFile) {
                        await db.productPicture.create({
                            picture: el.filename,
                            productId: pdata.id
                        })
                    }
                    resolve();
                })

                const b = await db.shippingOption.create({
                            optionName: sentOption,
                            price: sentOptionPrice,
                            amount: sentAmount,
                            productId: pdata.id
                        })
                
                const c = await db.productOption.create({
                            optionName:  productOption,
                            price: productOptionPrice,
                            productId: pdata.id,
                        })

                Promise.all([a, b, c]).then(result => {
                    return res.status(201).send({productId: pdata.id, optionId: result[2].id});
                })
            })   
        } else {
           return res.status(403).send({message: 'You are not allowed'});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}

const getAllProduct = async (req,res) => {
    try {
        const targetProduct = await db.product.findAll({
            include: [
                {
                    model: db.seller,
                    attributes: {
                        exclude: ['password', 'bankName', 'bankAccountNumber']
                    }
                },
                {
                    model: db.productPicture
                },
                {
                    model: db.productOption,
                    include: [
                        {
                            model: db.optionPicture
                        }
                    ]
                },
                {
                    model: db.shippingOption
                },
                {
                    model: db.review
                }
            ]
        });
        
        return res.status(200).send(targetProduct);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}

const getProductBySellerId = async (req,res) => {
    try {
        const sellerId = req.body.sellerId;

        if(!sellerId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetProduct = await db.product.findAll({
            where: {
                sellerId: sellerId
            },
            include: [
                {
                    model: db.seller,
                    attributes: {
                        exclude: ['password', 'bankName', 'bankAccountNumber']
                    }
                },
                {
                    model: db.productPicture
                },
                {
                    model: db.productOption,
                    include: [
                        {
                            model: db.optionPicture
                        }
                    ]
                },
                {
                    model: db.shippingOption
                }
            ]
        });
          
        return res.status(200).send(targetProduct); 

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}

const getProductByProductId = async (req,res) => {
    try {
        const productId = req.body.productId;

        if(!productId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetProduct = await db.product.findOne({
            where: {
                id: productId
            },
            include: [
                {
                    model: db.seller,
                    attributes: {
                        exclude: ['password', 'bankName', 'bankAccountNumber']
                    }
                },
                {
                    model: db.productPicture
                },
                {
                    model: db.productOption,
                    include: [
                        {
                            model: db.optionPicture
                        }
                    ]
                },
                {
                    model: db.shippingOption
                },
                {
                    model: db.review,
                    include: [
                        {
                            model: db.user,
                            attributes: {
                                exclude: ['password', 'bankName', 'bankAccountNumber']
                            }
                        }
                    ]
                }
            ]
        });

        if(!targetProduct) {
            return res.status(404).send({message: 'Product not found'});
        }

        
        return res.status(200).send(targetProduct); 

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}

const editProduct = async (req,res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const productId = req.body.productId
        const newProductDetail = req.body.productDetail;
    
        if(!productId || !newProductDetail) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetProduct = await db.product.findOne({where: {id:  productId}});
    
        if(targetProduct && targetProduct.sellerId === sellerId && status === 'seller') {
            await db.product.update({
                productDetail: newProductDetail
            },
            {
                where: {id: productId}
            });
            
            return res.status(201).send({message: 'Done'});  
        } else {
            return res.status(403).send({message: 'You are not allowed'});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}

const deleteProduct = async (req,res) => {
    try {
        const productId = req.body.productId
        const sellerId = req.user.id;
        const status = req.user.status;

        if(!productId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetProduct = await db.product.findOne({where: {id: productId}});
        const targetOrder = await db.order.findAll({where: {
            productId: productId,
            status: 'PREPARE_SHIPPING'
        }});
        
        if(targetOrder.length === 0) {
            if(targetProduct && targetProduct.sellerId === sellerId && status === 'seller') {
                const targetProductOption = await db.productOption.findAll({where: {productId: productId}});
        
                for (let e of targetProductOption) {
                    const targetPic = await db.optionPicture.findAll({where: {optionId: e.id}});

                    for (let p of targetPic) {
                        const found = await findFileByName('Upload/optionpic/', p.picture);
                        if(found) {
                            fs.unlinkSync(`Upload/optionpic/${p.picture}`);
                        }
                        
                        await db.optionPicture.destroy({where: {id: e.id}}); 
                    };

                    await db.productOption.destroy({where: {id: e.id}});
                };
        
                const targetProductPic = await db.productPicture.findAll({where: {productId: productId}});
        
                for (let e of targetProductPic) {
                    const found = await findFileByName('Upload/productpic/', e.picture);
                    if(found) {
                        fs.unlinkSync(`Upload/productpic/${e.picture}`);
                    }
                
                    await db.productPicture.destroy({where: {id: e.id}}); 
                };
        
                await db.shippingOption.destroy({where: {productId: productId}});  
                await db.cart.destroy({where: {productId: productId}});  
                await db.product.destroy({where: {id: productId}});
        
                return res.status(200).send({message: 'Done'});
            } else {
                return res.status(403).send({message: 'You are not allowed'});
            };
        } else {
            return res.status(400).send({message: 'There are still orders to prepare'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }   
}

const adminDeleteProduct = async (req,res) => {
    try {
        const productId = req.body.productId
        const status = req.user.status;
    
    
        if(!productId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
    
        const targetProduct = await db.product.findOne({where: {id: productId}});
        const targetOrder = await db.order.findAll({where: {
            productId: productId,
            [Op.or]: [
                {status: 
                    {
                        [Op.eq]: 'PREPARE_SHIPPING'
                    }
                },
                {status:
                    {
                        [Op.eq]: 'ON_DELIVERY'
                    }
                }
            ]
        }});
    
    
        if(targetProduct && status === 'admin') {
            const targetProductOption = await db.productOption.findAll({where: {productId: productId}});
    
            for (let e of targetProductOption) {
                const targetPic = await db.optionPicture.findAll({where: {optionId: e.id}});
    
                for (let p of targetPic) {
                    const found = await findFileByName('Upload/optionpic/', p.picture);
                    if(found) {
                        fs.unlinkSync(`Upload/optionpic/${p.picture}`);
                    }
                   
                    await db.optionPicture.destroy({where: {id: e.id}}); 
                };
    
                await db.productOption.destroy({where: {id: e.id}});
            };
    
            const targetProductPic = await db.productPicture.findAll({where: {productId: productId}});
    
            for (let e of targetProductPic) {
                const found = await findFileByName('Upload/productpic/', e.picture);
                if(found) {
                    fs.unlinkSync(`Upload/productpic/${e.picture}`);
                }
                
                await db.productPicture.destroy({where: {id: e.id}}); 
            };
    
            await db.shippingOption.destroy({where: {productId: productId}});  
            await db.cart.destroy({where: {productId: productId}});  
            await db.product.destroy({where: {id: productId}});
    
            if(targetOrder.length !== 0) {
                for (let e of targetOrder) {
                    if(e.status === 'PREPARE_SHIPPING') {
                        await db.order.update({
                            status: 'CANCLE'
                        },
                        {   
                            where: {id: e.id}
                        });
                    } else if(e.status === 'ON_DELIVERY') {
                        await db.order.destroy({where: {id: e.id}});
                    }
                };
            }
    
            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: 'You are not allowed'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
};



module.exports = {
    createProduct,
    getAllProduct,
    getProductBySellerId,
    getProductByProductId,
    editProduct,
    deleteProduct,
    adminDeleteProduct
}