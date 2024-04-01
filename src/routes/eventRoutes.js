const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventConroller');

// Define your routes
router.get('/find', eventController.getEventss);
router.post('/create', eventController.createEvents);

module.exports = router;