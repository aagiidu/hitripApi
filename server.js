const express = require('express');
const bodyparser=require("body-parser");
const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const salt = 10;
const UserRoute = require('./routes/user_routes');
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET=process.env.jwt;
const MONGODB_URL=process.env.mongodb;


mongoose.Promise = global.Promise;

require("./models/User");
require("./models/FbUser");
require("./models/Zar");
const Zar = mongoose.model("Zar");
const User = mongoose.model("User");
const FbUser = mongoose.model("FbUser");

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connection established successfully.');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.post('/signup', async (req,res)=>{
    const { phone, password:plainTextPassword } = req.body;
    const password = await bcrypt.hash(plainTextPassword, salt);
    try {
        const response = await User.create({
            phone,
            password
        })
        return res.send({status: 'success', data: response});
    } catch (error) {
        console.log(JSON.stringify(error));
        if(error.code === 11000){
            return res.send({status:'error', error:'Энэ утасны дугаараар хэрэглэгч бүртгүүлсэн байна.'})
        }
        throw error
    }
})

app.post('/register/fbuser', async (req,res) => {
    const { name, email, fbid, image } = req.body;
    let user = await FbUser.findOne({fbid}).lean();
    let response;
    if(!user){
        response = await FbUser.create({name, email, fbid, image});
        const token = signToken(response);
        return res.send({status: 'success', data: response, token});
    }else{
        response = await FbUser.updateOne({fbid},{$set: {name, email, image}});
        let user = await FbUser.findOne({fbid}).lean();
        const token = signToken(user);
        return res.send({status: 'success', data: user, token});
    }
})

// user login function
const verifyUserLogin = async (phone, password) => {
    try { 
        const user = await User.findOne({phone}).lean()
        // const mId = mongoose.Types.ObjectId(id);
        // const user = await User.findById(mId).lean()
        if(!user){
            return {status:'error', error:'Хэрэглэгч олдсонгүй'}
        }
        if(await bcrypt.compare(password,user.password)){
            // creating a JWT token
            const token = signToken({id:user._id, phone: user.phone, status: user.status, package: user.package, type:'user'});
            return {status:'ok', data:token}
        }
        return {status:'error',error:'Нэвтрэх мэдээлэл буруу байна'}
    } catch (error) {
        console.log(error);
        return {status:'error',error:'timed out'}
    }
}

const signToken = (data) => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: '2h'})
}

// login 
app.post('/login', async (req, res) => {
    const {phone, password} = req.body;
    // we made a function to verify our user login
    const response = await verifyUserLogin(phone, password);
    if(response.status === 'ok'){
        // storing our JWT web token as a cookie in our browser
        // res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); 
        res.json(response);
    }else{
        res.json(response);
    }
})

app.get('/zar/list', async (req, res) => {
    const response = await Zar.find().sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response });
});

const verifyToken = (req, res, next) => {
    try {
        // res.send({headers: req.headers})
        let token = null;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            return res.send({status:'error',error:'no token'});
        }
        const verify = jwt.verify(token, JWT_SECRET);
        console.log('verifyToken', verify);
        if(verify){
            // console.log('userdatafromtoken', verify);
            req.body.userData = verify;
            req.body.token = token;
            return next();
        }else{
            return res.send({status:'error', error:'no user'});
        };
    } catch (error) {
        console.log(JSON.stringify(error),"error");
        return res.send({status:'error', error})
    }
}

app.use('/user', verifyToken, UserRoute);

app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})