const express = require('express');
const router = express.Router();
const mosqueController = require('../controllers/mosqueController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, mosqueController.createMosque);
router.get('/', authMiddleware, mosqueController.getAllMosques);
router.get('/:id', mosqueController.getMosqueById);


module.exports = router;
