const mongoose= require('mongoose');
require("../models/User");
require("../models/Zar");
const User = mongoose.model("User");
const Zar = mongoose.model("Zar");
var ObjectId = require('mongodb').ObjectId;

getUserData = async (req, res) => {
    const { userData } = req.body
    const user = await User.findOne({phone: userData.phone}).lean()
    return res.status(200).send({user});
}

addZar = async (req, res) => {
    const {title, body, userData} = req.body
    console.log('userdata in controller', userData);
    try {
        const response = await Zar.create({
            title, body, phone: userData.phone
        })
        return res.send({status: 'success', data: response});
    } catch (error) {
        console.log(JSON.stringify(error));
        return res.send({status: 'error', data: error});
    }
}

zarList = async (req, res) => {
    const response = await Zar.find().sort({featured: -1, _id: -1}).limit(10);
    return res.send({status: 'success', data: response });
}

myZar = async (req, res) => {
    const userData = req.body.userData;
    const response = await Zar.find({phone: userData.phone}).sort({featured: -1, _id: -1}).limit(10);
    return res.send({status: 'success', data: response});
}

deleteZar = async (req, res) => {
    const {userData, zarId} = req.body;
    const deleted = await Zar.deleteOne({_id: new ObjectId(zarId)});
    const response = await Zar.find({phone: userData.phone}).sort({featured: -1, _id: -1}).limit(10);
    return res.send({status: 'success', data: response, deleted});
}

module.exports = {
    getUserData,
    addZar,
    zarList,
    myZar,
    deleteZar
}