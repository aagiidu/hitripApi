const mongoose= require('mongoose');
require("../models/Blog");
require("../models/Trip");
const jwt = require('jsonwebtoken');
const Blog = mongoose.model("Blog");
const Trip = mongoose.model("Trip");
var ObjectId = require('mongodb').ObjectId;
const JWT_SECRET=process.env.jwt;

addBlog = async (req, res) => {
    let result = verifyToken(req)
    console.log(result)
    if(!result){
        return res.status(200).send({status: 'error', data: 'Зөвхөн админ мэдээлэл оруулна'});
    }
    const { title, description, image } = req.body
    try {
        const response = await Blog.create({
            title, description, image
        })
        return res.status(200).send({status: 'success', data: response});
    } catch (error) {
        console.log(JSON.stringify(error));
        return res.status(200).send({status: 'error', data: error});
    }
}

updateBlog = async (req, res) => {
    let result = verifyToken(req)
    if(!result){
        return res.status(200).send({status: 'error', data: 'Зөвхөн админ мэдээлэл оруулна'});
    }
    const { id, title, description, image } = req.body
    try {
        const response = await Blog.updateOne({_id: new ObjectId(id)}, {$set: {
            title, description, image
        }});
        return res.status(200).send({status: 'success', data: response});
    } catch (error) {
        return res.status(200).send({status: 'error', data: error});
    }
}

deleteBlog = async (req, res) => {
    let result = verifyToken(req)
    if(!result){
        return res.status(200).send({status: 'error', data: 'Зөвхөн админ мэдээлэл оруулна'});
    }
    const {id} = req.body;
    const deleted = await Blog.deleteOne({_id: new ObjectId(id)});
    const response = await Blog.find({}).sort({_id: -1}).limit(100);
    return res.send({status: 'success', data: response, deleted});
}

deleteAllBlog = async (req, res) => {
    let result = verifyToken(req)
    if(!result){
        return res.status(200).send({status: 'error', data: 'Зөвхөн админ мэдээлэл оруулна'});
    }
    await Blog.deleteMany({});
    return res.send({status: 'success'});
}

/////////////// TRIPS //////////////
const verifyToken = (req) => {
    try {
        let token = null;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        console.log('token', token)
        if(!token) {
            return false;
        }
        let verify = jwt.verify(token, JWT_SECRET);
        if(!verify || verify.type !== 'admin'){
            return false
        }
        return true
    } catch (error) {
        console.log('error', error)
        return false
    }
}

addTrip = async (req, res) => {
    let result = verifyToken(req)
    if(!result){
        return res.status(200).send({status: 'error', data: 'bad token'});
    }
    const {  code, name, honog, urt, chiglel, marshrut, desc, featured, active } = req.body
    let images = []
    if(req.files.image1) images.push(`https://api.hitrip.mn/images/${req.files.image1[0].filename}`)
    if(req.files.image2) images.push(`https://api.hitrip.mn/images/${req.files.image2[0].filename}`)
    if(req.files.image2) images.push(`https://api.hitrip.mn/images/${req.files.image3[0].filename}`)
    try {
        const response = await Trip.create({ code, name, honog, urt, chiglel, marshrut, desc, images, featured, active })
        return res.status(200).send({status: 'success', data: response});
    } catch (error) {
        return res.status(200).send({status: 'error', data: error});
    } 
}

updateTrip = async (req, res) => {
    let result = verifyToken(req)
    if(!result){
        return res.status(200).send({status: 'error', data: 'bad token'});
    }
    const { id, code, name, honog, urt, chiglel, marshrut, desc, featured, active } = req.body
    let images = []
    if(req.files.image1) images.push(`https://api.hitrip.mn/images/${req.files.image1[0].filename}`)
    if(req.files.image2) images.push(`https://api.hitrip.mn/images/${req.files.image2[0].filename}`)
    if(req.files.image2) images.push(`https://api.hitrip.mn/images/${req.files.image3[0].filename}`)
    try {
        const response = await Trip.updateOne(
            {_id: new ObjectId(id)}, 
            {$set: { code, name, honog, urt, chiglel, marshrut, desc, images, featured, active }}
        );
        return res.status(200).send({status: 'success', data: response});
    } catch (error) {
        return res.status(200).send({status: 'error', data: error});
    }
}

deleteTrip = async (req, res) => {
    let result = verifyToken(req)
    if(!result){
        return res.status(200).send({status: 'error', data: 'bad token'});
    }
    const {id} = req.body;
    const deleted = await Trip.deleteOne({_id: new ObjectId(id)});
    const response = await Trip.find({}).sort({_id: -1}).limit(100);
    return res.send({status: 'success', data: response, deleted});
}

module.exports = {
    addBlog, deleteBlog, deleteAllBlog, updateBlog, addTrip, updateTrip, deleteTrip
}