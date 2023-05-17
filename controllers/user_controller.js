const mongoose= require('mongoose');
require("../models/FbUser");
require("../models/Zar");
const FbUser = mongoose.model("FbUser");
const Zar = mongoose.model("Zar");
var ObjectId = require('mongodb').ObjectId;

getUserData = async (req, res) => {
    const { userData } = req.body
    const user = await FbUser.findOne({fbid: userData.fbid}).lean()
    if(!user){
        return res.status(404).send({status: 'error', data: 'Хэрэглэгч олдсонгүй'});
    }
    return res.status(200).send({user});
}

addZar = async (req, res) => {
    const {title, body, userData} = req.body
    console.log('userdata in controller', userData);
    try {
        const response = await Zar.create({
            title, body, name: userData.name
        })
        return res.status(200).send({status: 'success', data: response});
    } catch (error) {
        console.log(JSON.stringify(error));
        return res.status(200).send({status: 'error', data: error});
    }
}

zarList = async (req, res) => {
    const response = await Zar.find().sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response });
}

myZar = async (req, res) => {
    const userData = req.body.userData;
    const response = await Zar.find({fbid: userData.fbid}).sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response});
}

deleteZar = async (req, res) => {
    const {userData, id} = req.body;
    const deleted = await Zar.deleteOne({_id: new ObjectId(id)});
    const response = await Zar.find({fbid: userData.fbid}).sort({featured: -1, _id: -1}).limit(100);
    return res.send({status: 'success', data: response, deleted});
}

module.exports = {
    getUserData,
    addZar,
    zarList,
    myZar,
    deleteZar
}