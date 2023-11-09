const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
require('dotenv').config();
const { registerValidator } = require("../validator/validator");
const htmlCreator = require('../create-email/htmlCreator');

const createAdminVerification = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        const err = registerValidator(email, username, password, 'admin');

        if(err) {
            return res.status(400).send({message: 'Invalid pettern of email or username or password'});
        }

        const targetAdmin = await db.admin.findAll();
        const targetUsername = await db.admin.findOne({where: {username: username}});
        const targetVerify = await db.verify.findOne({where: {email: email}});
        
        if(targetVerify) {
            await db.verify.destroy({where: {id: targetVerify.id}});
        }

        if(targetAdmin.length === 0) {
            const salt1 = bcrypt.genSaltSync(6);
            const salt2  = bcrypt.genSaltSync(12);
            await db.verify.create({
                status: 'admin',
                email: email,
                username: username,
                password: bcrypt.hashSync(password, salt2),
                ref: bcrypt.hashSync(username, salt1)
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
                    to: email,
                    subject: 'Project 1 Verification Email',
                    html: htmlCreator('verify', '', `${process.env.FONTEND_URL}/verification?ref=${data.ref}`)
                };

                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.verify.destroy({where: {id: data.id}})
                        throw err;
                    } else {
                        return res.status(200).send({message: 'Done'});
                    }
                });
            });
        } else if(targetAdmin[0].email.toLowerCase() === email.toLowerCase()) {
            if(!targetUsername) {
                const salt1 = bcrypt.genSaltSync(6);
                const salt2  = bcrypt.genSaltSync(12);
                await db.verify.create({
                    status: 'admin',
                    email: email,
                    username: username,
                    password: bcrypt.hashSync(password, salt2),
                    ref: bcrypt.hashSync(username, salt1)
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
                        to: email,
                        subject: 'Project 1 Verification Email',
                        html: htmlCreator('verify', '', `${process.env.FONTEND_URL}/verification?ref=${data.ref}`)
                    };
        
                    transporter.sendMail(option, async (err, info) => {
                        if(err) {
                            await db.verify.destroy({where: {id: data.id}});
                            throw err;
                        } else {
                            return res.status(200).send({message: 'Done'});
                        }
                    });
                });
                
            } else {
                return res.status(400).send({message: 'Username is already use'});
            }
        } else {
            return res.status(400).send({message: 'Invalid email address'});
        };
   
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const createAdmin =  async (req, res) => {
    try {
        const ref = req.body.ref;
        const targetVerify = await db.verify.findOne({where: {ref: ref, status: 'admin'}});
    
        if(targetVerify) {
            await db.admin.create({
                email: targetVerify.email.toLowerCase(),
                username: targetVerify.username,
                password: targetVerify.password
            })
            .then(async () => {
                await db.verify.destroy({where: {ref: ref}});
                return res.status(201).send({message: 'Successful registration'});  
            })     
        } else {
            return res.status(400).send({message: '"Session Expired" Please register again'});  
        };
    }  catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};


const adminLogin = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const targetAdmin = await db.admin.findOne({where: {username: username}});

        if(targetAdmin) {
            const isPasswordCorrect = bcrypt.compareSync(password, targetAdmin.password);

            if(isPasswordCorrect) {
                const payload = {
                    status: 'admin',
                    username: targetAdmin.username
                };
        
                const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: +process.env.JWT_EXP});
                const adminData = {
                    token: token,
                    status: 'admin'
                };
        
                return res.status(200).send(adminData);
            } else {
                return res.status(400).send({message: 'Invalid Username or Password'});
            }
        } else {
            return res.status(400).send({message: 'Invalid Username or Password'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const getAdmin = async (req, res) => {
    try {
        const username = req.user.username;
        const targetAdmin = await db.admin.findOne({where: {username: username}});
    
        if(targetAdmin) {
            return res.status(200).send(targetAdmin);
        } else {
            return res.status(404).send({message: 'Not found'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const adminCreateAdminReset = async (req, res) => {
    try {
        const username = req.user.username;
        const targetAdmin = await db.admin.findOne({where: {username: username}});
        const targetEmail = await db.admin.findAll();

        const targetReset = await db.reset.findOne({where: {adminId: targetAdmin.id}});
        
        if(targetReset) {
            await db.reset.destroy({where: {adminId: targetAdmin.id}});
        }
    
        if(targetAdmin) {
            let salt = bcrypt.genSaltSync(6);
            await db.reset.create({
                adminId: targetAdmin.id,
                ref: bcrypt.hashSync(username, salt) 
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
                    to: targetEmail[0].email,
                    subject: 'Project 1 Reset password',
                    html: htmlCreator('reset', targetAdmin.username, `${process.env.FONTEND_URL}/reset?ref=${data.ref}`)
                };
    
                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.reset.destroy({where: {id: data.id}})
                        throw err;
                    } else {
                        return res.status(200).send({message: 'Done'});
                    }
                });
            })
        } else {
            return res.status(403).send({message: 'You are not allowed'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const guestCreateAdminReset = async (req, res) => {
    try {
        const username = req.body.username;
        const targetAdmin = await db.admin.findOne({where: {username: username}});
        const targetEmail = await db.admin.findAll();

        if(targetAdmin) {
            const targetReset = await db.reset.findOne({where: {adminId: targetAdmin.id}});
        
            if(targetReset) {
                await db.reset.destroy({where: {adminId: targetAdmin.id}});
            }
    
            const salt = bcrypt.genSaltSync(6);
            await db.reset.create({
                adminId: targetAdmin.id,
                ref: bcrypt.hashSync(username, salt) 
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
                    to: targetEmail[0].email,
                    subject: 'Project 1 Reset password',
                    html: htmlCreator('reset', targetAdmin.username, `${process.env.FONTEND_URL}/reset?ref=${data.ref}`)
                };
    
                transporter.sendMail(option, async (err, info) => {
                    if(err) {
                        await db.reset.destroy({where: {id: data.id}})
                        throw err;
                    } else {
                        return res.status(200).send({message: 'Done'});
                    }
                });
            })
        } else {
            return res.status(400).send({message: 'Invalid Username'});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
}

const adminReset = async (req, res) => {
    try {
        const ref = req.body.ref;
        const password = req.body.password;
        const targetReset = await db.reset.findOne({where: {ref: ref}});

        const err = registerValidator('', '', password, 'admin');

        if(err.password) {
            return res.status(400).send({message: 'Invalid request value'});
        }
        
        if(targetReset) {
            const salt = bcrypt.genSaltSync(12);
            await db.admin.update({
                password: bcrypt.hashSync(password, salt)
            },
            {
                where: {id: targetReset.adminId}
            })
            .then(async () => {
                await db.reset.destroy({where: {ref: ref}})
            });

            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(400).send({message: '"Session Expired" Please reset again'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.user.id;
        const targetAdmin = await db.admin.findOne({where: {id: adminId}});
        
        if(targetAdmin) {
            await db.admin.destroy({where: {id: targetAdmin.id}})

            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(400).send({message: 'Admin not found'});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
};



module.exports = {
    createAdminVerification,
    adminLogin,
    createAdmin,
    getAdmin,
    adminCreateAdminReset,
    guestCreateAdminReset,
    adminReset,
    deleteAdmin
}