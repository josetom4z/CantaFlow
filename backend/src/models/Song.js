const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    default: 'Ministério de Louvor',
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'Louvor Congregacional',
      'Coral & Orquestra',
      'Jovens & Adolescentes',
      'Ministério Infantil',
      'Hinos & Harpa Cristã',
      'Playbacks & Ensaios',
      'Especiais & Ceia',
      'Outros'
    ],
    default: 'Louvor Congregacional',
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  originalFileName: {
    type: String,
    default: '',
  },
  duration: {
    type: Number, // duration in seconds
    default: 0,
  },
  fileSizeBytes: {
    type: Number,
    default: 0,
  },
  keySignature: {
    type: String,
    default: 'G',
  },
  bpm: {
    type: Number,
    default: 72,
  },
  lyrics: {
    type: String,
    default: '',
  },
  chords: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Song', songSchema);
