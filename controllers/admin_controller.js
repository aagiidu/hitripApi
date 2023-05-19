const mongoose= require('mongoose');
require("../models/Blog");

const Blog = mongoose.model("Blog");
var ObjectId = require('mongodb').ObjectId;

addBlog = async (req, res) => {
    const { title, description, image, userData } = req.body
    if(userData.type !== 'admin'){
        return res.status(200).send({status: 'error', data: 'Зөвхөн админ мэдээлэл оруулна'});
    }
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
    const { id, title, description, image, userData } = req.body
    if(userData.type !== 'admin'){
        return res.status(200).send({status: 'error', data: 'Зөвхөн админ засвар оруулна'});
    }
    console.log('req.body', id, title, description, image, userData);
    //try {
        const response = await Blog.update({_id: new ObjectId(id)}, {$set: {
            title, description, image
        }});
        console.log(response);
        return res.status(200).send({status: 'success', data: response});
    /* } catch (error) {
        console.log(JSON.stringify(error));
        return res.status(200).send({status: 'error', data: error});
    } */
}

deleteBlog = async (req, res) => {
    const {id, userData} = req.body;
    if(userData.type !== 'admin'){
        return res.status(200).send({status: 'error', data: 'Энэ үйлдлийн зөвхөн админ хийнэ'});
    }
    const deleted = await Blog.deleteOne({_id: new ObjectId(id)});
    const response = await Blog.find({}).sort({timestamp: -1}).limit(100);
    return res.send({status: 'success', data: response, deleted});
}

deleteAllBlog = async (req, res) => {
    const {userData} = req.body;
    if(userData.type !== 'admin'){
        return res.status(200).send({status: 'error', data: 'Энэ үйлдлийн зөвхөн админ хийнэ'});
    }
    await Blog.deleteMany({});
    return res.send({status: 'success'});
}

module.exports = {
    addBlog, deleteBlog, deleteAllBlog, updateBlog
}