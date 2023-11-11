const db = require('../models');

const getAllBill = async (req, res) => {
    try {
        const status =  req.user.status;

        if(status === 'admin') {
            const targetBill = await db.bill.findAll({
                include: [
                    {
                        model: db.admin,
                        attributes: {
                            exclude: ['password','email']
                        }
                    },
                    {
                        model: db.seller,
                        attributes: {
                            exclude: ['password']
                        }
                    }  
                ]
            });
            
            return res.status(200).send(targetBill);
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    };
}


const getBillBySellerId = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status =  req.user.status;

        if(status === 'seller') {
            const targetBill = await db.bill.findAll({
                where: {sellerId: sellerId}
            });
            
            return res.status(200).send(targetBill);
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    };
}

const adminUpdateBill = async (req, res) => {
    try {
        const status = req.user.status;
        const adminId = req.user.id;
        const billId = req.body.billId;
        const ref = req.body.ref;
        const time = new Date();
    
        if(!billId || !ref) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        if(status === 'admin') {
            await db.bill.update({
                status: 'PAID',
                ref: ref,
                adminId: adminId,
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes()
            },
            {
                where: {id: billId}
            });
            
            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        };

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    };
}

const sellerUpdateBill = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const status = req.user.status;
        const billId = req.body.billId;
        const time = new Date();

        if(!billId) {
            return res.status(400).send({message: 'Invalid request value'});
        }

        const targetBill = await db.bill.findOne({where: {id: billId}});

        if(status === 'seller' && targetBill && targetBill.sellerId === sellerId) {
            await db.bill.update({
                status: 'PENDING',
                date: time.getDate(),
                month: time.getMonth() + 1,
                year: time.getFullYear(),
                hour: time.getHours(),
                minute: time.getMinutes()
            },
            {
                where: {id: billId}
            });

            return res.status(200).send({message: 'Done'});
        } else {
            return res.status(403).send({message: "You don't have permission to access"});
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    };
}

module.exports = {
    getAllBill,
    getBillBySellerId,
    sellerUpdateBill,
    adminUpdateBill
}
