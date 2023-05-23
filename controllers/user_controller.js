const axios = require('axios');
const mongoose= require('mongoose');
require("../models/FbUser");
require("../models/Zar");
const FbUser = mongoose.model("FbUser");
const Zar = mongoose.model("Zar");
var ObjectId = require('mongodb').ObjectId;

const username = 'TEST_MERCHANT';
const password = '123456';

getUserData = async (req, res) => {
    const { userData, token } = req.body
    console.log('########### getUserData ############', userData);
    const user = await FbUser.findOne({fbid: userData.fbid}).lean()
    if(!user){
        return res.send({status: 'error', data: 'Хэрэглэгч олдсонгүй'});
    }
    return res.status(200).send({status: 'success', data: user, token });
}

addZar = async (req, res) => {
    const { body, userData } = req.body
    console.log('userdata in controller', userData);
    try {
        const {name, fbid} = userData;
        const response = await Zar.create({
            body, name, fbid
        })
        return res.status(200).send({status: 'success', data: response});
    } catch (error) {
        console.log(JSON.stringify(error));
        return res.status(200).send({status: 'error', data: error});
    }
}

/* zarList = async (req, res) => {
    const response = await Zar.find().sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response });
} */

myZar = async (req, res) => {
    const userData = req.body.userData;
    const response = await Zar.find({fbid: userData.fbid}).sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response});
}

deleteZar = async (req, res) => {
    const {userData, id} = req.body;
    const deleted = await Zar.deleteOne({_id: new ObjectId(id), fbid: userData.fbid});
    const response = await Zar.find({fbid: userData.fbid}).sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response, deleted});
}

deleteAllZar = async (req, res) => {
    const deleted = await Zar.deleteMany({});
    return res.send({status: 'success'});
}

verifyToken = async (req, res) => {
    return res.send({status: 'success'});
}

turnOnOff = async (req, res) => {
    const { userData, status } = req.body
    const response = await FbUser.updateOne({fbid: userData.fbid}, {$set: {status}});
    console.log('OnOff', response);
    return res.status(200).send({status: 'success', data: user, token });
}

// Payment step #1
requestInvoice = async (req, res) => {
    const { userData, tripCode, amount } = req.body
    // const user = await FbUser.findOne({fbid: userData.fbid}).lean();

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    axios.post('https://merchant.qpay.mn/v2/auth/token', {}, {
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.log('requestInvoice Response:', response.data);
        return res.status(200).send({status: 'success', data: response.data, tripCode, amount });
    })
    .catch(error => {
        console.error('requestInvoice Error:', error.response.data);
        return res.status(200).send({status: 'error', data: error.response.data, tripCode, amount });
    });

    // return res.status(200).send({status: 'success', data: user, token });
}

module.exports = {
    getUserData,
    addZar,
    myZar,
    deleteZar,
    deleteAllZar,
    verifyToken,
    turnOnOff,
    requestInvoice
}