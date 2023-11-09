const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const { Op } = require('sequelize');
const { registerValidator, userValidator } = require("../validator/validator");
const htmlCreator = require('../create-email/htmlCreator');

const createVerification = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const targetEmail = await db.user.findOne({where: {email: email.toLowerCase()}});
        const targetVerify = await db.verify.findOne({where: {email: email}});
        
        if(targetVerify) {
            await db.verify.destroy({where: {id: targetVerify.id}});
        }


        const err = registerValidator(email, '', password, 'user');

        if(err) {
            return res.status(400).send({message: 'Invalid pettern of email or password'});
        }

        if(targetEmail) {
            return res.status(400).send({message: 'Email address is already used'});
        }

     
        const salt1 = bcrypt.genSaltSync(6);
        const salt2 = bcrypt.genSaltSync(12);
        await db.verify.create({
            status: 'user',
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
                    await db.verify.destroy({where: {id: data.id}});
                    throw err;
                } else {
                    return res.status(201).send({message: 'Done'});
                };
            });
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const createUser = async (req,res) => {
    try {
        const ref = req.body.ref;
        const targetRef = await db.verify.findOne({where: {ref: ref, status: 'user'}});

        if(targetRef) {
            await db.user.create({
                email: targetRef.email,
                password: targetRef.password, 
                phoneNumber: '',
                receiveName: '',
                address: '',
                bankName: '',
                bankAccountNumber: ''
            })
            .then(async (data) => {
                await db.user.update({
                    profileName: `User #${data.id}`
                },
                {
                    where: {id: data.id}
                });

                await db.verify.destroy({where: {ref: ref}})
            });

            return res.status(201).send({message: 'Successful registration'});
        } else {
            return res.status(400).send({message: '"Session Expired" Please register again'});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const login = async (req,res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        if(!email || !password) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetUser = await db.user.findOne({where: {email: email}});

        if(targetUser) {
            const isPasswordCorrect = bcrypt.compareSync(password, targetUser.password);

            if(isPasswordCorrect) {
                const payload = {
                    id: targetUser.id,
                    status: 'user'
                };

                const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: +process.env.JWT_EXP});
                const userData = {
                    status: 'user',
                    token: token
                };
                return res.status(200).send(userData);
            } else {
                return res.status(400).send({message: 'Invalid username or password '});
            }
        } else {
            return res.status(400).send({message: 'Invalid username or password '});
        }
    
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const getMyData = async (req,res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
    
        if(!userId || !status) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        if(status === 'user') {
            const targetUser = await db.user.findOne({
                where: {
                    id: userId
                },
                include: [
                    {
                        model: db.favorite,
                        include: [
                            {
                                model: db.seller,
                                attributes: {
                                    exclude: ['password', 'bankName', 'bankAccountNumber']
                                }
                            }
                        ]
                    }
                ]
            });
    
            if(targetUser) {
                return res.status(200).send(targetUser);
            } else {
                return res.status(404).send('Not found');
            }
    
        } else {
            return res.status(403).send('You are not allowed');
        } 

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const getUserData = async (req,res) => {
    try {
        const userId = req.body.userId;

        if(!userId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetUser = await db.user.findOne({
            where: {id: userId},
            attributes: {exclude: ['password', 'receiveName', 'email', 'phoneNumber', 'address', 'bankName', 'bankAccountNumber']}
        });

        if(targetUser) {
            return res.status(200).send(targetUser);
        } else {
            return res.status(404).send('Not found');
        }  
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const getUserDataByAdmin = async (req,res) => {
    try {
        const userId = req.body.userId;
        const status = req.user.status;

        if(!userId) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        if(status === 'admin') {
            const targetUser = await db.user.findOne({
                where: {id: userId},
                attributes: {exclude: ['password']}
            });
        
            return res.status(200).send(targetUser);   
        } else {
            return res.status(403).send({message: 'You are not allowed'});  
        } 

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};


const updateUserData = async (req,res) => {
    try {
        const userId = req.user.id;
        const oldName = req.user.profileName;
        const status = req.user.status;
        const input = JSON.parse(req.body.input);
     
        const err = userValidator(input.profileName, input.phoneNumber, input.bankAccountNumber);
    
        if(err) {
            return res.status(400).send({message: 'Invalid pattern of "name" or "mobile number" or "bank account number"'});
        }
        
        if(input.profileName !== oldName) {
            const targetName = await db.user.findOne({where: {profileName: input.profileName}})
            if(targetName) {
                return res.status(400).send({message: 'This name is already used'});
            }
        }
    
        if(status !== 'user') {
            return res.status(403).send({message: 'You are not allowed'});
        }
      
        await db.user.update(input, {
            where: {id: userId}
        });
    
        if(req.file) {
            await db.user.update({
                profilePicture: req.file.filename
            },{
                where: {
                    id: userId
                }
            })
        }
        return res.status(200).send({message: 'Done'});     

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
}

const userCreateReset = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUser = await db.user.findOne({where: {id: userId}});

        const targetReset = await db.reset.findOne({where: {userId: userId}});
        
        if(targetReset) {
            await db.reset.destroy({where: {userId: userId}});
        }

        if(targetUser) {
            const salt = bcrypt.genSaltSync(6);
            await db.reset.create({
                userId: userId,
                ref: bcrypt.hashSync(targetUser.email, salt)    
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
                    to: targetUser.email,
                    subject: 'Project 1 Reset Password',
                    html: htmlCreator('reset', targetUser.profileName, `${process.env.FONTEND_URL}/reset?ref=${data.ref}`)
                };

                transporter.sendMail(option, (err, info) => {
                    if(err) {
                        return res.status(400).send(err);
                    } else {
                        return res.status(201).send({message: 'Done'});
                    };
                });
            });
        } else {
            return res.status(400).send({message: 'User not found'});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const guestCreateReset = async (req, res) => {
    try {
        const email = req.body.email;
        const targetUser = await db.user.findOne({where: {email: email}});

  
        if(targetUser) {
            const targetReset = await db.reset.findOne({where: {userId: targetUser.id}});
        
            if(targetReset) {
                await db.reset.destroy({where: {userId: targetUser.id}});
            }
     
            const salt = bcrypt.genSaltSync(6);
            await db.reset.create({
                userId: targetUser.id,
                ref: bcrypt.hashSync(targetUser.email, salt)    
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
                    to: targetUser.email,
                    subject: 'Project 1 Reset Password',
                    html: htmlCreator('reset', targetUser.profileName, `${process.env.FONTEND_URL}/reset?ref=${data.ref}`)
                };
    
                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.reset.destroy({where: {id: data.id}});
                        throw err ;
                    } else {
                        return res.status(201).send({message: 'Done'});
                    };
                });
            });
        } else {
            return res.status(400).send({message: 'Invalid email address'});
        }

    }  catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
};

const userReset = async (req, res) => {
    try {
        const ref = req.body.ref;
        const password = req.body.password;
        const targetRef = await db.reset.findOne({where: {ref: ref}});
    
        const err = registerValidator('', '', password, 'user');
    
        if(err.password) {
            return res.status(400).send({message: 'Invalid pettern of password'})
        }
        
        if(targetRef) {
            const salt = bcrypt.genSaltSync(12);
            await db.user.update({
                password: bcrypt.hashSync(password, salt)
            },
            {
                where: {
                    id: targetRef.userId
                }
            })
            .then(async () => {
                await db.reset.destroy({where: {ref: ref}})
               
                return res.status(200).send({message: 'Done'});    
            })

        } else {
            return res.status(400).send({message: '"Session Expired" Please reset again'});
        };  

    }  catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }  
};

const deleteUser = async (req,res) => {
    try {
        const userId = req.user.id;
        const status = req.user.status;
        const targetOrder = await db.order.findAll({where: {
            userId: userId,
            status: ['PREPARE_SHIPPING', 'ON_DELIVERY']
        }});
    
        if(status === 'user' && targetOrder.length === 0) {
            const targetUser = await db.user.findOne({where: {id: userId}})
            if(targetUser.profilePicture) {
                fs.unlinkSync(`./Upload/userprofilepic/${targetUser.profilePicture}`);
            }
    
            await db.notification.destroy({where: {id: userId}});
            await db.favorite.destroy({where: {id: userId}});
            await db.cart.destroy({where: {id: userId}}); 
            await db.user.destroy({where: {id: userId}});
            
            
            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: 'You are not allowed'});
        }   

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }  
}

module.exports = {
    createVerification,
    createUser,
    login,
    getMyData,
    getUserData,
    updateUserData,
    userCreateReset,
    guestCreateReset,
    userReset,
    deleteUser,
    getUserDataByAdmin
}