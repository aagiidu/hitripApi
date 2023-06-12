const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdminController = require('../controllers/admin_controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/blog/add', AdminController.addBlog);
router.post('/blog/update', AdminController.updateBlog);
router.post('/blog/delete', AdminController.deleteBlog);
router.post('/blog/delete/all', AdminController.deleteAllBlog);

router.post('/trip/add', upload.single('image'), AdminController.addTrip);
router.post('/trip/update', upload.single('image'), AdminController.updateTrip);
router.post('/trip/delete', AdminController.deleteTrip);

module.exports = router;
