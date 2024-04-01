const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventConroller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/find', eventController.getEventss);
router.post('/create',upload.single('file'), eventController.createEvents);

module.exports = router;