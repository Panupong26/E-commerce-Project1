const db = require('../models');

const getRefData = async (req, res) => {
    try {
        const ref = req.body.ref;

        if(!ref) {
            return res.status(400).send({message: 'Invalid request value'});
        }
    
        const targetRef = await db.reset.findOne({
            where: {
                ref: ref
            },
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
    
        if(targetRef)  {
            return res.status(200).send(targetRef);
        } else {
            return res.status(400).send({message: '"Session Expired" Please reset again'});
        } 
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error');
    }
}

module.exports = {
    getRefData
}