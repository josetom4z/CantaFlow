const Song = require('../models/Song');
const Folder = require('../models/Folder');
const path = require('path');
const fs = require('fs');

// @desc    Upload new song / audio
// @route   POST /api/songs/upload
const uploadSong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de áudio foi enviado.' });
    }

    const {
      title,
      artist,
      category,
      folderId,
      lyrics,
      chords,
      keySignature,
      bpm,
      tags,
    } = req.body;

    const audioRelativeUrl = `/uploads/audio/${req.file.filename}`;
    const cleanTitle = title && title.trim().length > 0
      ? title.trim()
      : path.parse(req.file.originalname).name.replace(/[-_]/g, ' ');

    let parsedFolder = null;
    if (folderId && folderId !== 'null' && folderId !== 'undefined' && folderId !== '') {
      parsedFolder = folderId;
    }

    let parsedTags = [];
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const song = await Song.create({
      title: cleanTitle,
      artist: artist && artist.trim().length > 0 ? artist.trim() : 'Ministério de Louvor',
      category: category || 'Louvor Congregacional',
      folder: parsedFolder,
      audioUrl: audioRelativeUrl,
      originalFileName: req.file.originalname,
      fileSizeBytes: req.file.size,
      keySignature: keySignature || 'G',
      bpm: Number(bpm) || 72,
      lyrics: lyrics || '',
      chords: chords || '',
      tags: parsedTags,
      uploadedBy: req.user && req.user._id !== 'guest_user_id' ? req.user._id : null,
    });

    const populated = await Song.findById(song._id).populate('folder');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all songs (with optional filtering)
// @route   GET /api/songs
const getSongs = async (req, res) => {
  try {
    const { category, folderId, search, tag } = req.query;
    let query = {};

    if (category && category !== 'Todos') {
      query.category = category;
    }

    if (folderId) {
      if (folderId === 'none' || folderId === 'root') {
        query.folder = null;
      } else {
        query.folder = folderId;
      }
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { lyrics: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const songs = await Song.find(query).populate('folder').sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get song by ID
// @route   GET /api/songs/:id
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('folder');
    if (!song) {
      return res.status(404).json({ message: 'Música não encontrada.' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update / Rename song & categorize
// @route   PUT /api/songs/:id
const updateSong = async (req, res) => {
  try {
    const {
      title,
      artist,
      category,
      folderId,
      lyrics,
      chords,
      keySignature,
      bpm,
      tags,
    } = req.body;

    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Música não encontrada.' });
    }

    if (title !== undefined) song.title = title.trim();
    if (artist !== undefined) song.artist = artist.trim();
    if (category !== undefined) song.category = category;
    if (folderId !== undefined) {
      song.folder = folderId === '' || folderId === 'none' || folderId === null ? null : folderId;
    }
    if (lyrics !== undefined) song.lyrics = lyrics;
    if (chords !== undefined) song.chords = chords;
    if (keySignature !== undefined) song.keySignature = keySignature;
    if (bpm !== undefined) song.bpm = Number(bpm) || song.bpm;
    if (tags !== undefined) song.tags = Array.isArray(tags) ? tags : song.tags;

    await song.save();
    const updated = await Song.findById(song._id).populate('folder');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Música não encontrada.' });
    }

    // Try deleting physical file if local
    if (song.audioUrl && song.audioUrl.startsWith('/uploads/audio/')) {
      const filePath = path.join(__dirname, '../../', song.audioUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Could not delete audio file from disk:', err.message);
        }
      }
    }

    await Song.deleteOne({ _id: song._id });
    res.json({ message: 'Música removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
};
