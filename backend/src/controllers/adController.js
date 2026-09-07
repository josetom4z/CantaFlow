const Ad = require('../models/Ad');

// @desc    Get active ads
// @route   GET /api/ads
const getAds = async (req, res) => {
  try {
    const { position } = req.query;
    let query = { isActive: true };

    if (position) {
      query.position = position;
    }

    const ads = await Ad.find(query);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record click on an ad
// @route   POST /api/ads/:id/click
const recordClick = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (ad) {
      ad.clicks += 1;
      await ad.save();
    }
    res.json({ success: true, clicks: ad ? ad.clicks : 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAds,
  recordClick,
};
