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

router.post('/trip/add', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
]), AdminController.addTrip);
router.post('/trip/update', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
]), AdminController.updateTrip);
router.post('/trip/delete', AdminController.deleteTrip);

module.exports = router;
