const express = require('express');
const router = express.Router();
const {
  uploadSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
} = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getSongs)
  .post(protect, upload.single('audio'), uploadSong);

router.route('/:id')
  .get(getSongById)
  .put(protect, updateSong)
  .delete(protect, deleteSong);

module.exports = router;
