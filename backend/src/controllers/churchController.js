const Church = require('../models/Church');

// Haversine formula to compute distance in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc    Get all regional churches (with filter & distance calc)
// @route   GET /api/churches
const getChurches = async (req, res) => {
  try {
    const { search, neighborhood, day, userLat, userLng, city } = req.query;
    let query = {};

    if (neighborhood && neighborhood !== 'Todos') {
      query.neighborhood = neighborhood;
    }

    if (city && city !== 'Todas') {
      query.city = city;
    }

    if (day && day !== 'Todos') {
      query['cultosSchedule.day'] = { $regex: new RegExp(day, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { neighborhood: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { pastor: { $regex: search, $options: 'i' } },
      ];
    }

    let churches = await Church.find(query).sort({ isSede: -1, name: 1 }).lean();

    // If user provided GPS coordinates, calculate distance
    if (userLat && userLng) {
      const uLat = parseFloat(userLat);
      const uLng = parseFloat(userLng);
      if (!isNaN(uLat) && !isNaN(uLng)) {
        churches = churches.map((church) => {
          const distKm = calculateDistance(
            uLat,
            uLng,
            church.location.lat,
            church.location.lng
          );
          return {
            ...church,
            distanceKm: Number(distKm.toFixed(1)),
          };
        });
        churches.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

    // Get list of unique neighborhoods & cities for filtering
    const allNeighborhoods = await Church.distinct('neighborhood');
    const allCities = await Church.distinct('city');

    res.json({
      churches,
      total: churches.length,
      neighborhoods: allNeighborhoods,
      cities: allCities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get church by ID
// @route   GET /api/churches/:id
const getChurchById = async (req, res) => {
  try {
    const church = await Church.findById(req.params.id);
    if (!church) {
      return res.status(404).json({ message: 'Igreja não encontrada.' });
    }
    res.json(church);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new church
// @route   POST /api/churches
const createChurch = async (req, res) => {
  try {
    const {
      name,
      neighborhood,
      address,
      city,
      state,
      postalCode,
      location,
      googleMapsUrl,
      cultosSchedule,
      pastor,
      phone,
      instagram,
      photoUrl,
      isSede,
    } = req.body;

    if (!name || !neighborhood || !address) {
      return res.status(400).json({ message: 'Nome, bairro e endereço são obrigatórios.' });
    }

    const defaultMapsUrl = googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${name}, ${address}, ${neighborhood}, ${city || 'Guaratinguetá'}`)}`;

    const church = await Church.create({
      name,
      neighborhood,
      address,
      city: city || 'Guaratinguetá',
      state: state || 'SP',
      postalCode: postalCode || '12500-000',
      location: {
        lat: location?.lat !== undefined ? Number(location.lat) : -22.8164,
        lng: location?.lng !== undefined ? Number(location.lng) : -45.1953,
      },
      googleMapsUrl: defaultMapsUrl,
      cultosSchedule: Array.isArray(cultosSchedule) ? cultosSchedule : [],
      pastor: pastor || 'Pr. Dirigente',
      phone: phone || '(12) 3122-0000',
      instagram: instagram || 'https://www.instagram.com/adguaratingueta/',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
      isSede: Boolean(isSede),
    });

    res.status(201).json(church);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update church details
// @route   PUT /api/churches/:id
const updateChurch = async (req, res) => {
  try {
    const church = await Church.findById(req.params.id);
    if (!church) {
      return res.status(404).json({ message: 'Igreja não encontrada.' });
    }

    const {
      name,
      neighborhood,
      address,
      city,
      state,
      postalCode,
      location,
      googleMapsUrl,
      cultosSchedule,
      pastor,
      phone,
      instagram,
      photoUrl,
      isSede,
    } = req.body;

    if (name !== undefined) church.name = name;
    if (neighborhood !== undefined) church.neighborhood = neighborhood;
    if (address !== undefined) church.address = address;
    if (city !== undefined) church.city = city;
    if (state !== undefined) church.state = state;
    if (postalCode !== undefined) church.postalCode = postalCode;
    if (location) {
      church.location = {
        lat: location.lat !== undefined ? Number(location.lat) : church.location.lat,
        lng: location.lng !== undefined ? Number(location.lng) : church.location.lng,
      };
    }
    if (googleMapsUrl !== undefined) church.googleMapsUrl = googleMapsUrl;
    if (cultosSchedule !== undefined) church.cultosSchedule = cultosSchedule;
    if (pastor !== undefined) church.pastor = pastor;
    if (phone !== undefined) church.phone = phone;
    if (instagram !== undefined) church.instagram = instagram;
    if (photoUrl !== undefined) church.photoUrl = photoUrl;
    if (isSede !== undefined) church.isSede = Boolean(isSede);

    const updatedChurch = await church.save();
    res.json(updatedChurch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete church
// @route   DELETE /api/churches/:id
const deleteChurch = async (req, res) => {
  try {
    const church = await Church.findById(req.params.id);
    if (!church) {
      return res.status(404).json({ message: 'Igreja não encontrada.' });
    }

    await church.deleteOne();
    res.json({ message: 'Igreja removida com sucesso.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload church photo
// @route   POST /api/churches/upload-photo
const uploadChurchPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma foto enviada.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const photoUrl = `${protocol}://${host}/uploads/images/${req.file.filename}`;

    res.status(201).json({
      success: true,
      filename: req.file.filename,
      photoUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChurches,
  getChurchById,
  createChurch,
  updateChurch,
  deleteChurch,
  uploadChurchPhoto,
};
