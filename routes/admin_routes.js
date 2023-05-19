const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin_controller');

router.post('/blog/add', AdminController.addBlog);
router.post('/blog/update', AdminController.updateBlog);
router.post('/blog/delete', AdminController.deleteBlog);
router.post('/blog/delete/all', AdminController.deleteAllBlog);

module.exports = router;
