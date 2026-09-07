const express = require('express');
const router = express.Router();
const {
  getChurches,
  getChurchById,
  createChurch,
  updateChurch,
  deleteChurch,
  uploadChurchPhoto,
} = require('../controllers/churchController');
const uploadImage = require('../middleware/imageUploadMiddleware');

// Photo upload route
router.post('/upload-photo', uploadImage.single('photo'), uploadChurchPhoto);

// Main collection routes
router.route('/')
  .get(getChurches)
  .post(createChurch);

// Single item routes
router.route('/:id')
  .get(getChurchById)
  .put(updateChurch)
  .delete(deleteChurch);

module.exports = router;
