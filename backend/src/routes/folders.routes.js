const express = require('express');
const router = express.Router();
const {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} = require('../controllers/folderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFolders)
  .post(protect, createFolder);

router.route('/:id')
  .put(protect, updateFolder)
  .delete(protect, deleteFolder);

module.exports = router;
