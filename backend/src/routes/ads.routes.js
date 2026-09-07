const express = require('express');
const router = express.Router();
const { getAds, recordClick } = require('../controllers/adController');

router.get('/', getAds);
router.post('/:id/click', recordClick);

module.exports = router;
