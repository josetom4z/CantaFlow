const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  advertiser: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  ctaText: {
    type: String,
    default: 'Saiba Mais',
  },
  bannerUrl: {
    type: String,
    default: '',
  },
  targetUrl: {
    type: String,
    default: '#',
  },
  position: {
    type: String,
    enum: ['bottom_banner', 'in_feed', 'interstitial_modal'],
    default: 'bottom_banner',
  },
  badgeText: {
    type: String,
    default: 'Patrocinado • PixelLab Ads',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ad', adSchema);
