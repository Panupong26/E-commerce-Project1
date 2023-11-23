const db = require('../models');

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const productName = req.body.productName;
        const orderPicture = req.body.orderPicture;
        const productOption = req.body.productOption;
        const shippingOption = req.body.shippingOption;
        const quantity = req.body.quantity;
        const totalPrice = req.body.totalPrice;
        const paymentOption = req.body.paymentOption;
        const destination =  req.body.destination;
        const receiver = req.body.receiver;
        const phoneNumber = req.body.phoneNumber;
        const time = new Date();
        const sellerId = req.body.sellerId;
        const productId = req.body.productId;

    
        if(!productId || 
            !productName || 
            !orderPicture ||
            !productOption || 
            !shippingOption || 
            !quantity || 
            typeof quantity !== 'number' || 
            !totalPrice || 
            typeof totalPrice !== 'number' ||
            !paymentOption ||
            !destination ||
            !receiver ||
            !phoneNumber ||
            !sellerId ||
            !productId
         ) {
             return res.status(400).send({message: 'Invalid request value'});
         }
    
        if(status === 'user') {
            await db.order.create({
                productName: productName,
                orderPicture: orderPicture,
                productOption: productOption,
                shippingOption: shippingOption,
                quantity: quantity,
                trackingNumber: '',
                totalPrice: totalPrice,
                paymentOption: paymentOption,
                destination: destination,
                receiver: receiver,
                phoneNumber: phoneNumber,
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes(),
                status: 'PREPARING',
                userId: userId,
                sellerId: sellerId,
                productId: productId
            }).then(async (x) => {
                await db.notification.create({
                    message: `(order: ${x.id}) ${x.productName} has been ordered`,
                    notificationPicture: orderPicture,
                    notificationType: 'TO_SELLER_ORDER',
                    status: 'UNREAD',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    sellerId: sellerId,
                })
                
                return res.status(201).send({message: 'Done'});   
            });
        } else {
            return res.status(403).send({message: "You don't have permission to access"})
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}


const getOrderByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        
        if(status === 'user') {
            const targetOrder = await db.order.findAll({
                where: {userId: userId}
            });
            
            return res.status(200).send(targetOrder);
        } else {
            return res.status(403).send({message: "You don't have permission to access"})
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    } 
}

const getOrderBySellerId = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        
        if(status === 'seller') {
            const targetOrder = await db.order.findAll({
                where: {sellerId: sellerId}
            });
                
            return res.status(200).send(targetOrder);
        } else {
            return res.status(403).send({message: "You don't have permission to access"})
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    } 
}

const getAllOrder = async (req, res) => {
    try {
        const status = req.user.status;

        if(status === 'admin') {
            const targetOrder = await db.order.findAll({
                include: [
                    {
                        model: db.user,
                        attributes: {
                            exclude: ['password']
                        }
                    },
                    {
                        model: db.seller,
                        attributes: {
                            exclude: ['password']
                        }
                    },
                    {
                        model: db.admin,
                        attributes: {
                            exclude: ['password', 'email']
                        }
                    }
                    
                ]
            });
            
           return  res.status(200).send(targetOrder);   
        } else {
           return res.status(403).send({message: "You don't have permission to access"})
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    } 
}

const userCancleOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const orderId = req.body.orderId;
        const time = new Date();

        if(!orderId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetOrder = await db.order.findOne({where: {id: orderId}});

        if(status === 'user' && targetOrder.status === 'PREPARING' && targetOrder.userId === userId) {
            await db.order.update({
                status: targetOrder.paymentOption === 'COD'? 'CANCLE' : 'PENDING_REFUND'
            },
            {
                where: {id: orderId}
            }).then(async () => {
                await db.notification.create({
                    message: `(order: ${orderId}) ${targetOrder.productName} order has been cancled`,
                    notificationPicture: targetOrder.orderPicture,
                    notificationType: 'TO_SELLER_ORDER',
                    status: 'UNREAD',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    sellerId: targetOrder.sellerId,
                });
                
                return res.status(200).send({message: 'Order cancled'});
            });
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    } 
}

const sellerCancleOrder = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const orderId = req.body.orderId;
        const time = new Date();

        if(!orderId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetOrder = await db.order.findOne({where: {id: orderId}});

        if(status === 'seller' && targetOrder.status === 'PREPARING' && targetOrder.sellerId === sellerId) {
            await db.order.update({
                status: targetOrder.paymentOption === 'COD'? 'CANCLE' : 'PENDING_REFUND'
            },
            {
                where: {id: orderId}
            }).then(async () => {
                await db.notification.create({
                    message: `(order: ${orderId}) ${targetOrder.productName} order has been cancled`,
                    notificationPicture: targetOrder.orderPicture,
                    notificationType: 'TO_USER_ORDER',
                    status: 'UNREAD',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    userId: targetOrder.userId,
                });
                
                return res.status(200).send({message: 'Order cancled'});    
            });
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    } 
}

const sellerUpdateOrder = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const orderId = req.body.orderId;
        const trackingNumber = req.body.trackingNumber;
        const time = new Date();

        if(!orderId || !trackingNumber) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetOrder = await db.order.findOne({where: {id: orderId}});

        if(status === 'seller' && targetOrder.status === 'PREPARING' && targetOrder.sellerId === sellerId) {
            await db.order.update({
                status: 'IN_TRANSIT',
                trackingNumber: trackingNumber,
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes()
            },
            {
                where: {id: orderId}
            }).then(async () => {
                await db.notification.create({
                    message: `(order: ${orderId}) ${targetOrder.productName} is being delivered.`,
                    notificationPicture: targetOrder.orderPicture,
                    notificationType: 'TO_USER_ORDER',
                    status: 'UNREAD',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    userId: targetOrder.userId,
                });
                
                return res.status(200).send({message: 'Order update'});
            });
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}


const userUpdateOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const orderId = req.body.orderId;
        const time = new Date();
    
        if(!orderId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetOrder = await db.order.findOne({where: {id: orderId}});
        const targetProduct = await db.product.findOne({where: {id: targetOrder.productId}});
        const targetSeller = await db.seller.findOne({where: {id: targetProduct.sellerId}});
    
        if(status === 'user' && targetOrder.status === 'IN_TRANSIT' && targetOrder.userId === userId) {
            await db.order.update({
                status: 'RECEIVED',
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes()
            },
            {
                where: {id: orderId}
            });

            if(targetOrder.paymentOption !== 'COD') {
                await db.bill.create({
                    status: 'NOT_YET_SUBMITTED',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    sellerId: targetOrder.sellerId,
                    orderId: orderId,
                    productName: targetOrder.productName,
                    productOption: targetOrder.productOption,
                    quantity: targetOrder.quantity,
                    totalIncome: targetOrder.totalPrice
                })
            }
    
            await db.notification.create({
                message: `(order: ${orderId}) ${targetOrder.productName} has been received by buyer`,
                notificationPicture: targetOrder.orderPicture,
                notificationType: 'TO_SELLER_ORDER',
                status: 'UNREAD',
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes(),
                sellerId: targetOrder.sellerId,
            })
    
            await db.product.update({
                productSellCount: targetProduct.productSellCount + targetOrder.quantity
            },
            {
                where: {id: targetProduct.id}
            })
    
            await db.seller.update({
                totalSellCount: targetSeller.totalSellCount + 1
            },
            {
                where: {id: targetSeller.id}
            })
    
            return res.status(200).send({message: 'Order updated'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}

const adminUpdateOrder = async (req, res) => {
    try {
        const adminId = req.user.id;
        const status = req.user.status;
        const orderId = req.body.orderId;
        const time = new Date();
    
        if(!orderId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetOrder = await db.order.findOne({where: {id: orderId}});
        const targetProduct = await db.product.findOne({where: {id: targetOrder.productId}});
        const targetSeller = await db.seller.findOne({where: {id: targetProduct.sellerId}});
    
        if(status === 'admin' && targetOrder.status === 'IN_TRANSIT') {
            await db.order.update({
                status: 'RECEIVED',
                adminId: adminId,
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes()
            },
            {
                where: {id: orderId}
            });

            if(targetOrder.paymentOption !== 'COD') {
                await db.bill.create({
                    status: 'NOT_YET_SUBMITTED',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    sellerId: targetOrder.sellerId,
                    orderId: orderId,
                    productName: targetOrder.productName,
                    productOption: targetOrder.productOption,
                    quantity: targetOrder.quantity,
                    totalIncome: targetOrder.totalPrice
                })
            }
    
            await db.notification.create({
                message: `(order: ${orderId}) ${targetOrder.productName} has been force updated by admin`,
                notificationPicture: targetOrder.orderPicture,
                notificationType: 'TO_SELLER_ORDER',
                status: 'UNREAD',
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes(),
                sellerId: targetOrder.sellerId,
            })
    
            await db.product.update({
                productSellCount: targetProduct.productSellCount + targetOrder.quantity
            },
            {
                where: {id: targetProduct.id}
            })
    
            await db.seller.update({
                totalSellCount: targetSeller.totalSellCount + 1
            },
            {
                where: {id: targetSeller.id}
            })
    
            return res.status(200).send({message: 'Order updated'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }  
}

const refundOrder = async (req, res) => {
    try {
        const status = req.user.status;
        const adminId = req.user.id;
        const orderId = req.body.orderId;
        const ref = req.body.ref;

        if(!orderId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        if(status === 'admin') {
            await db.order.update({
                ref: ref,
                status: 'REFUNDED',
                adminId: adminId
            },
            {
                where: {id: orderId}
            })
            
            return res.status(200).send({message: 'Done'});   
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    } 
} ;

module.exports = {
    createOrder,
    getOrderByUserId,
    getOrderBySellerId,
    getAllOrder,
    userCancleOrder,
    sellerCancleOrder,
    sellerUpdateOrder,
    userUpdateOrder,
    adminUpdateOrder,
    refundOrder
}