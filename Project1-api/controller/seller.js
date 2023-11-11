const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodeMailer = require('nodemailer');
const { registerValidator, userValidator } = require('../validator/validator');
const htmlCreator = require('../create-email/htmlCreator');
const findFileByName = require('../findFile/findFileByName');
require('dotenv').config();

const createVerification = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const targetSeller = await db.seller.findOne({where: {email: email}});
        const targetVerify = await db.verify.findOne({where: {email: email}});
        
        if(targetVerify) {
            await db.verify.destroy({where: {id: targetVerify.id}});
        }
    
        const err = registerValidator(email, '', password, 'seller');
    
        if(err) {
            return res.status(400).send({message: 'Invalid pettern of email or password'})
        }
    
        if(!targetSeller) {
            const salt1 = bcrypt.genSaltSync(6);
            const salt2 = bcrypt.genSaltSync(12);
    
            await db.verify.create({
                status: 'seller',
                email: email.toLowerCase(),
                password: bcrypt.hashSync(password, salt2),
                ref: bcrypt.hashSync(email, salt1)
            })
            .then((data) => {
                const transporter = nodeMailer.createTransport({
                    service: process.env.EMAIL_SERVICE,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
    
                const option = {
                    from: `${process.env.FROM} <${process.env.EMAIL}>`,
                    to: data.email,
                    subject: 'Project 1 Verification Email',
                    html: htmlCreator('verify', '', `${process.env.FONTEND_URL}/verification?ref=${data.ref}`)
                };
    
                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.verify.destroy({where: {id: data.id}})
                        throw err;
                    } else {
                        return res.status(201).send({message: 'Done'});
                    };
                });
            })
        } else {
            return res.status(400).send({message: 'Email address is already used'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const createSeller = async (req,res) => {
    try {
        const ref = req.body.ref;
        const targetRef = await db.verify.findOne({where: {ref: ref, status: 'seller'}});
        const unique = `${new Date().getTime()}`.slice(8, 12) + `${Math.random()}`.slice(3,6); 
       
        if(targetRef) {
            await db.seller.create({
                email: targetRef.email,
                password: targetRef.password,
                storeName: "STORE" + unique,
                totalSellCount: 0,
                storePicture: '',
                phoneNumber: '',
                facebook: '',
                instagram: '',
                address: '',
                bankName: '',
                bankAccountNumber: ''
            }).then(async () => {

                await db.verify.destroy({where: {ref: ref}});
                
                return res.status(200).send({message: 'Successful registration'});   
            });    
        } else {
            return res.status(400).send({message: '"Session Expired" Please register again'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const login = async (req,res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
    
        const targetUser = await db.seller.findOne({where: {email: email}});
    
        if(targetUser) {
            const isPasswordCorrect = bcrypt.compareSync(password, targetUser.password);
    
            if(isPasswordCorrect) {
                const payload = {
                    id: targetUser.id,
                    status: 'seller'
                };
    
                const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: +process.env.JWT_EXP});
                const sellerData = {
                    status: 'seller',
                    token: token
                };
                return res.status(200).send(sellerData);
            } else {
                return res.status(400).send({message: 'Invalid username or password '});
            }
        } else {
            return res.status(400).send({message: 'Invalid username or password '});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
};

const getMyData = async (req,res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
    
        if(status === 'seller') {
            const targetSeller = await db.seller.findOne({
                where: {id: sellerId}
            });
            
            return res.status(200).send(targetSeller);   
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
};

const getShopData = async (req,res) => {
    try {
        const { shopId } = req.params;

        if(!shopId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetShop = await db.seller.findOne({
            where: {id: shopId}, 
            attributes: {exclude: ['password', 'bankName', 'bankAccountNumber']}
        });
    
        if(targetShop) {
            return  res.status(200).send(targetShop);  
        } else {
            return  res.status(404).send({message: 'Not found'});  
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
};


const getShopDataByName = async (req,res) => {
    try {
        const shopName = req.params.shopName || ' ';
        
        const targetShop = await db.seller.findOne({
            where: {storeName: shopName}, 
            attributes: {exclude: ['password', 'bankName', 'bankAccountNumber']}
        });
    
        if(!targetShop) {
            return res.status(404).send({message: 'Not found'});
        }
    
        return  res.status(200).send(targetShop); 

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
};

const getAllShopData = async (req,res) => {
    try {
        const targetShop = await db.seller.findAll({
            attributes: {exclude: ['password', 'bankName', 'bankAccountNumber']}
        });
        return res.status(200).send(targetShop);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
};

const adminGetShopData = async (req,res) => {
    try {
        const status = req.user.status;
        const { sellerId } = req.params;

        if(!sellerId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        if(status === 'admin') {
            const targetShop = await db.seller.findOne({
                attributes: {exclude: ['password']},
                where: {id: sellerId}
            });
            
            return res.status(200).send(targetShop);
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }   
};


const updateShopData = async (req,res) => {
    try {
        const sellerId = req.user.id;
        const oldName = req.user.storeName;
        const input = JSON.parse(req.body.input);
        const file = req.file;

        const err = userValidator(input.storeName, input.phoneNumber, input.bankAccountNumber);

        if(err) {
            return res.status(400).send({message: 'Invalid pattern of "name" or "mobile number" or "bank account number"'});
        }

        if(input.storeName !== oldName) {
            const targetName = await db.seller.findOne({where: {storeName: input.storeName}})
            if(targetName) {
                return res.status(400).send({message: 'This name is already used'});
            }
        }

        if(file) {
            input.storePicture = file.filename ;
        }

        await db.seller.update(input, {
            where: {
                id: sellerId
            }
        })

        return res.status(200).send({message: 'Done!'});

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }   
};

const sellerCreateReset = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const targetSeller = await db.seller.findOne({where: {id: sellerId}});

        const targetReset = await db.reset.findOne({where: {sellerId: sellerId}});
        
        if(targetReset) {
            await db.reset.destroy({where: {sellerId: sellerId}});
        }

        if(targetSeller) {
            const salt = bcrypt.genSaltSync(6);
            await db.reset.create({
                sellerId: sellerId,
                ref: bcrypt.hashSync(targetSeller.email, salt)
            })
            .then((data) => {
                const transporter = nodeMailer.createTransport({
                    service: process.env.EMAIL_SERVICE,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                const option = {
                    from: `${process.env.FROM} <${process.env.EMAIL}>`,
                    to: targetSeller.email,
                    subject: 'Project 1 Reset Password',
                    html: htmlCreator('reset', targetSeller.storeName, `${process.env.FONTEND_URL}/reset?ref=${data.ref}`)
                };

                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.reset.destroy({where: {id: data.id}});
                        throw err;
                    } else {
                        return res.status(201).send({message: 'Done'});
                    };
                });
            });
        } else {
            return res.status(400).send({message: 'Seller not found'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }   
};

const guestCreateReset = async (req, res) => {
    try {
        const email = req.body.email;
        const targetSeller = await db.seller.findOne({where: {email: email}});

    
        if(targetSeller) {
            const targetReset = await db.reset.findOne({where: {sellerId: targetSeller.id}});
        
            if(targetReset) {
                await db.reset.destroy({where: {sellerId: targetSeller.id}});
            }

            const salt = bcrypt.genSaltSync(6);
            await db.reset.create({
                sellerId: targetSeller.id,
                ref: bcrypt.hashSync(targetSeller.email, salt)    
            })
            .then((data) => {
                const transporter = nodeMailer.createTransport({
                    service: process.env.EMAIL_SERVICE,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
    
                const option = {
                    from:`${process.env.FROM} <${process.env.EMAIL}>`,
                    to: targetSeller.email,
                    subject: 'Project 1 Reset Password',
                    html: htmlCreator('reset', targetSeller.storeName, `${process.env.FONTEND_URL}/reset?ref=${data.ref}`)
                };
    
                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.reset.destroy({where: {id: data.id}});
                        throw err;
                    } else {
                        return res.status(201).send({message: 'Done'});
                    };
                });
            });
        } else {
            return res.status(400).send({message: 'Invalid email address'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }   
};

const sellerReset = async (req, res) => {
    try {
        const ref = req.body.ref;
        const password = req.body.password;
        const targetRef = await db.reset.findOne({where: {ref: ref}});
    
        const err = registerValidator('', '', password, 'seller');
        
        if(err.password) {
            return res.status(400).send({message: 'Invalid pettern of password'})
        }
        
        if(targetRef) {
            const salt = bcrypt.genSaltSync(12);
            await db.seller.update({
                password: bcrypt.hashSync(password, salt)
            },
            {
                where: {
                    id: targetRef.sellerId
                }
            })
            .then(async () => {
                await db.reset.destroy({where: {ref: ref}})
                .then(() => {
                    return res.status(200).send({message: 'Done'});
                })
            })
    
        } else {
            return res.status(400).send({message: '"Session Expired" Please reset again'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }   
};

const deleteSeller = async (req,res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
    
        const targetOrder = await db.order.findAll({where: {
            sellerId: sellerId,
            status: ['PREPARE_SHIPPING', 'ON_DELIVERY']
        }});
    
        if(status === 'seller' && targetOrder.length === 0) {
            const targetSeller = await db.seller.findOne({where: {id: sellerId}});
           
            if(targetSeller.storePicture) {
                const found = await findFileByName('Upload/sellerprofilepic/', targetSeller.storePicture);
                if(found) {
                    fs.unlinkSync(`./Upload/sellerprofilepic/${targetSeller.storePicture}`);
                }
            };
    
            const targetProduct = await db.product.findAll({where: {sellerId: sellerId}});
    
            for (let e of targetProduct) {
                const targetOption = await db.productOption.findAll({where: {productId: e.id}});
    
                for (let o of targetOption) {
                    await db.productOption.destroy({where: {id: o.id}});    
    
                    const targetOptionPic = await db.optionPicture.findAll({where: {optionId: o.id}});
                    
                    if(targetOptionPic.length !== 0) {
                        for (let p of targetOptionPic) {
                            const found = await findFileByName('Upload/optionpic/', p.picture);
                            if(found) {
                                fs.unlinkSync(`./Upload/optionpic/${p.picture}`);
                            }
                            
                            await db.optionPicture.destroy({where: {id: p.id}});
                        };
                    };
    
                };
    
                const targetProductPic = await db.productPicture.findAll({where: {productId: e.id}});
    
                for(let pp of targetProductPic) {
                    const found = await findFileByName('Upload/productpic/', pp.picture);
                    if(found) {
                        fs.unlinkSync(`./Upload/productpic/${pp.picture}`);
                    }
                    
                    await db.productPicture.destroy({where: {id: pp.id}});
                }
                
                await db.review.destroy({where: {productId: e.id}});
                await db.shippingOption.destroy({where: {productId: e.id}});
                await db.product.destroy({where: {id: e.id}});
            };
     
            await db.notification.destroy({where: {sellerId: sellerId}});
            await db.favorite.destroy({where: {sellerId: sellerId}});
            await db.bill.destroy({where: {sellerId: sellerId}});
            await db.seller.destroy({where: {id: sellerId}});
            
            return res.status(200).send({message: 'Done'});   
        } else {
            return res.status(400).send({message: 'Cannot delete account because of you still have "Prepare Shipping" order or "On Delivery" order'});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }  
};


module.exports = {
    createVerification,
    createSeller,
    login,
    getMyData,
    getShopData,
    getShopDataByName,
    adminGetShopData,
    updateShopData,
    sellerCreateReset,
    guestCreateReset,
    sellerReset,
    deleteSeller,
    getAllShopData
}