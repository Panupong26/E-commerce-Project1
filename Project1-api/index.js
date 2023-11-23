const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');
const sellerRouter = require('./Router/sellerRouter');
const userRouter = require('./Router/userRouter');
const productRouter = require('./Router/productRouter');
const productOptionRouter = require('./Router/productOptionRouter');
const shippingOptionRouter = require('./Router/shippingOptionRouter');
const orderRouter = require('./Router/orderRouter');
const cartRouter = require('./Router/cartRouter');
const billRouter = require('./Router/billRouter');
const notificationRouter = require('./Router/notificationRouter');
const favoriteRouter = require('./Router/favoriteRouter');
const reviewRouter = require('./Router/reviewRouter');
const adminRouter = require('./Router/adminRouter');
const resetRouter = require('./Router/resetRouter');
const verifyRouter = require('./Router/verifyRouter');
const findFileByName = require('./findFile/findFileByName');
const paymentRouter = require('./Router/paymentRouter');

require('dotenv').config();

require('./config/passport');

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

app.get('/userprofilepic/:file', async function(req, res){
    const found = await findFileByName('Upload/userprofilepic/', req.params.file);
    if(found) {
        return res.download('Upload/userprofilepic/' + req.params.file);
    } else {
        return res.download('Upload/userprofilepic/default.png');
    }
})
app.get('/sellerprofilepic/:file', async function(req, res){
    const found = await findFileByName('Upload/sellerprofilepic/', req.params.file);
    if(found) {
        return res.download('Upload/sellerprofilepic/' + req.params.file);
    } else {
        return res.download('Upload/sellerprofilepic/default.png');
    }
})
app.get('/productpic/:file', async function(req, res){
    const found = await findFileByName('Upload/productpic/', req.params.file);
    if(found) {
        return res.download('Upload/productpic/' + req.params.file);
    } else {
        return res.download('Upload/productpic/default.jpg');
    }
})
app.get('/optionpic/:file', async function(req, res){
    const found = await findFileByName('Upload/optionpic/', req.params.file);
    if(found) {
        return res.download('Upload/optionpic/' + req.params.file);
    } else {
        return res.download('Upload/optionpic/default.jpg');
    }
})


app.use(ratelimit({
    windowMs: 1000*60,
    max: 200
}));

app.use('/seller', sellerRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/productoption', productOptionRouter);
app.use('/shippingoption', shippingOptionRouter);
app.use('/order', orderRouter);
app.use('/cart', cartRouter);
app.use('/bill', billRouter);
app.use('/notification', notificationRouter);
app.use('/favorite', favoriteRouter);
app.use('/review', reviewRouter);
app.use('/admin', adminRouter);
app.use('/reset', resetRouter);
app.use('/verify', verifyRouter);
app.use('/payment', paymentRouter);

app.use((err, req, res, next) => {
    if(err) {
        return res.status(err.status).send(err.message);
    }
})


db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 8000, () => {console.log(`sever is running at port ${process.env.PORT}`)});
})

