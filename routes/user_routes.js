const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');

// router.get('/:agentId/info', UserController.getAgent);
router.get('/data', UserController.getUserData);
router.post('/zar/add', UserController.addZar);
router.post('/zar/delete', UserController.deleteZar);
router.get('/my/zar', UserController.myZar);
router.get('/delete/all/zar', UserController.deleteAllZar);
router.get('/verify/token', UserController.verifyToken);

module.exports = router;
