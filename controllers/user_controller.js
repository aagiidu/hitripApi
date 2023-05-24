const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const mongoose= require('mongoose');
require("../models/FbUser");
require("../models/Zar");
require("../models/Invoice");
const FbUser = mongoose.model("FbUser");
const Zar = mongoose.model("Zar");
const Invoice = mongoose.model("Invoice");
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
    const token = await getTokenFromQpay();
    const invoice = await getInvoiceFromQpay(token, userData, tripCode, amount);
    return res.status(200).send({status: 'success', data: invoice });
}

getTokenFromQpay = async () => {
    return new Promise((resolve, reject) => {
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
        axios.post('https://merchant.qpay.mn/v2/auth/token', {}, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        })
        .then(async response => {
            console.log('requestInvoice Response:', response.data);
            const token = response.data.access_token
            resolve(token);
        })
        .catch(error => {
            console.error('requestInvoice Error:', error);
            reject(error);
        });
        
    });
}

getInvoiceFromQpay = async (token, userData, tripCode, amount) => {
    return new Promise((resolve, reject) => {
        const invoiceId = uuidv4();
        const { fbid } = userData;
        const postData = {
            "invoice_code": "TEST_INVOICE",
            "sender_invoice_no": invoiceId,
            "invoice_receiver_code": `${fbid}`, // ?? 
            "sender_branch_code":"APP",
            "invoice_description": tripCode,
            "enable_expiry": "false",
            "allow_partial": "false",
            "allow_exceed": "false",
            "amount": `${amount}`,
            "callback_url": "https://api.hitrip.mn/trip/list",
            "tax_customer_code": "5395305"
        };
        console.log('Qpay query', postData);
        axios.post('https://merchant.qpay.mn/v2/invoice', postData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(async response => {
            let q = response.data;
            delete q.qr_text
            delete q.qr_image
            const inv = await Invoice.create({
                fbid, invoiceId, tripCode, amount
            })
            console.log('Invoice Response:', q);
            resolve(q);
        })
        .catch(error => {
            console.error('Invoice Error:', error);
            reject(error);
        });
    });
}

qpayCallBack = async (req, res) => {
    const { invoiceId } = req.params;
    console.log('qpayCallBack', invoiceId)
}

cancelInvoice = async (req, res) => {
    const { invoiceId } = req.body
    const token = await getTokenFromQpay();
    let delres;
    axios.delete(`https://merchant.qpay.mn/v2/invoice/${invoiceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(async response => {
            let q = response.data;
            delres = await Invoice.deleteOne({invoiceId});
            console.log('Invoice Response:', q);
            return res.status(200).send({status: 'success', data: q, delres });
        })
        .catch(async error => {
            console.error('Invoice Error:', error.response.data);
            delres = await Invoice.deleteOne({invoiceId});
            return res.status(200).send({status: 'error', data: error.response.data, delres });
        });
    
}

module.exports = {
    getUserData,
    addZar,
    myZar,
    deleteZar,
    deleteAllZar,
    verifyToken,
    turnOnOff,
    requestInvoice,
    qpayCallBack,
    cancelInvoice
}