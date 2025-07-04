const express = require('express');
const router = express.Router();
const mosqueController = require('../controllers/mosqueController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, mosqueController.createMosque);
router.post('/join/:code', authMiddleware, mosqueController.joinMosque);
router.get('/', authMiddleware, mosqueController.getAllMosques);


module.exports = router;
