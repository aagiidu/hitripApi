const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');

// router.get('/:agentId/info', UserController.getAgent);
router.get('/data', UserController.getUserData);
router.post('/zar/add', UserController.addZar);
router.post('/zar/delete', UserController.deleteZar);
router.get('/zar/list', UserController.zarList);
router.get('/my/zar', UserController.myZar);

module.exports = router;
