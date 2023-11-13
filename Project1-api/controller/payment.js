require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const db = require("../models");
const bcrypt = require("bcrypt");


const createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const item = req.body.item;
        const receiver = req.body.receiver;
        const phoneNumber = req.body.phoneNumber;
        const destination = req.body.destination;
        const paymentOption = req.body.paymentOption;

        if(!item || !receiver || !phoneNumber || !destination || !paymentOption) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetRef = await db.payment.findOne({where: {userId: userId}});

        if(targetRef) {
            await db.payment.destroy({where: {userId: userId}});
        }

        const salt = bcrypt.genSaltSync(6);

        await db.payment.create({
            ref: bcrypt.hashSync(`${userId}`, salt),
            item: item,
            receiver: receiver,
            phoneNumber: phoneNumber,
            destination: destination,
            paymentOption: paymentOption, 
            userId: userId  
        })
        .then(async data => {

            const paymentMethod = {
                CARD: "card",
                QR: "promptpay"
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: [paymentMethod[paymentOption]],
                line_items: [...JSON.parse(item)].map(e => {
                    return {
                        price_data: {
                            currency: 'thb',
                            product_data: {
                                name: `${e.productName}(${e.productOption}) X ${e.quantity} (${e.shippingOption})`
                            },
                            unit_amount: +(e.totalPrice)*100
                        },
                        quantity: 1
                    }
                }),
                mode: 'payment',
                success_url: `${process.env.FONTEND_URL}/paymentsuccess?ref=${data.ref}`,
                cancel_url: `${process.env.FONTEND_URL}/paymentsuccess?ref=bringback`
            })
            return res.status(200).send({url: session.url});
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: err.message})
    }
}

const createOreder = async (req, res) => {
    try {
        const ref = req.body.ref;
        const time = new Date();

        if(!ref) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetRef = await db.payment.findOne({where: {ref: ref}})

        if(!targetRef) {
            return res.status(404).send({message: "Payment's ref not found"});
        }

        for(let order of JSON.parse(targetRef.item)) {
            const targetProduct = await db.product.findOne({where: {id: order.productId}});

            await db.order.create({
                productName: order.productName,
                productOption: order.productOption,
                shippingOption: order.shippingOption,
                orderPicture: order.orderPicture? order.orderPicture : order.cartPicture,
                quantity: order.quantity,
                totalPrice: order.totalPrice,
                paymentOption: targetRef.paymentOption,
                receiver: targetRef.receiver,
                phoneNumber: targetRef.phoneNumber,
                destination: targetRef.destination,
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes(),
                tackingNumber: '',
                status: 'PREPARE_SHIPPING',
                productId: order.productId,
                sellerId: targetProduct.sellerId,
                userId: targetRef.userId
            })
            .then(async (x) => {
                await db.notification.create({
                    message: `(order: ${x.id}) ${x.productName} has been ordered`,
                    notificationPicture: x.orderPicture,
                    notificationType: 'TO_SELLER_ORDER',
                    status: 'UNREAD',
                    date: time.getDate(),
                    month: time.getMonth() + 1,
                    year: time.getFullYear(),
                    hour: time.getHours(),
                    minute: time.getMinutes(),
                    sellerId: x.sellerId,
                });

                if(order.id) {
                    await db.cart.destroy({where: {id: order.id}});
                }
                
            })   
        }

        await db.payment.destroy({where: {ref: targetRef.ref}});

        return res.status(201).send({message: 'Done!'})

    } catch (err) {
        console.log(err);
        return res.status(500).send({message: err.message});
    }
}
module.exports = {
    createPayment,
    createOreder
}