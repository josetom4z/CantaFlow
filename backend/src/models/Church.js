const mongoose = require('mongoose');

const churchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    default: 'Guaratinguetá',
    trim: true,
  },
  state: {
    type: String,
    default: 'SP',
    trim: true,
  },
  postalCode: {
    type: String,
    default: '12500-000',
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  googleMapsUrl: {
    type: String,
    required: true,
  },
  cultosSchedule: [
    {
      day: { type: String, required: true },
      time: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, default: '' },
    },
  ],
  pastor: {
    type: String,
    default: 'Pr. Regional',
  },
  phone: {
    type: String,
    default: '(12) 3122-0000',
  },
  instagram: {
    type: String,
    default: 'https://www.instagram.com/adguaratingueta/',
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
  },
  isSede: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Church', churchSchema);
