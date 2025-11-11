const express = require('express');
const router = express();

router.use('/login', require('./login'));
router.use('/side',require('./sidebar'));
router.use('/profile', require('./profileRoutes'));
router.use('/location', require('./locationRoutes'));

console.log("API router loaded.");

module.exports = router;