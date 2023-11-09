const db = require("../models");

const getVerifyStatus = async (req, res) => {
    try {
        const ref = req.body.ref;

        if(!ref) {
            return res.status(400).send({message: 'Invalid request value'})
        }

        const targetRef = await db.verify.findOne({where: {ref: ref}});

        if(!targetRef) {
            return res.status(400).send({message: 'Session Expired Please register again'})
        } 

        return res.status(200).send(targetRef.status);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal sever error')
    }
}

module.exports = {
    getVerifyStatus
}