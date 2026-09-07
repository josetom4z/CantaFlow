const Folder = require('../models/Folder');
const Song = require('../models/Song');

// @desc    Get all folders with song counts
// @route   GET /api/folders
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find().sort({ name: 1 }).lean();

    // Attach song counts
    const foldersWithCount = await Promise.all(
      folders.map(async (folder) => {
        const songCount = await Song.countDocuments({ folder: folder._id });
        return {
          ...folder,
          songCount,
        };
      })
    );

    // Also get count of songs not in any folder (root / sem pasta)
    const unfiledCount = await Song.countDocuments({ folder: null });

    res.json({
      folders: foldersWithCount,
      unfiledCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new folder
// @route   POST /api/folders
const createFolder = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Nome da pasta é obrigatório.' });
    }

    const folder = await Folder.create({
      name: name.trim(),
      color: color || '#8b5cf6',
      icon: icon || 'Folder',
      description: description || '',
      userId: req.user && req.user._id !== 'guest_user_id' ? req.user._id : null,
    });

    res.status(201).json({
      ...folder.toObject(),
      songCount: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update folder
// @route   PUT /api/folders/:id
const updateFolder = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: 'Pasta não encontrada.' });
    }

    if (name) folder.name = name.trim();
    if (color) folder.color = color;
    if (icon) folder.icon = icon;
    if (description !== undefined) folder.description = description;

    await folder.save();
    const songCount = await Song.countDocuments({ folder: folder._id });

    res.json({
      ...folder.toObject(),
      songCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete folder
// @route   DELETE /api/folders/:id
const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Pasta não encontrada.' });
    }

    // Set songs in this folder to unassigned (null)
    await Song.updateMany({ folder: folder._id }, { $set: { folder: null } });

    await Folder.deleteOne({ _id: folder._id });
    res.json({ message: 'Pasta removida e músicas movidas para a raiz.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};
