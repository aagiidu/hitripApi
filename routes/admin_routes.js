const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin_controller');

router.post('/blog/add', UserController.addBlog);
router.post('/blog/delete', UserController.deleteBlog);

module.exports = router;
