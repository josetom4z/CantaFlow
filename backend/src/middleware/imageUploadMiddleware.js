const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadImagesDir = path.join(__dirname, '../../uploads/images');
if (!fs.existsSync(uploadImagesDir)) {
  fs.mkdirSync(uploadImagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadImagesDir);
  },
  filename: function (req, file, cb) {
    const cleanOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `church-${uniqueSuffix}-${cleanOriginal}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem inválido. Apenas JPG, PNG, WEBP ou GIF são permitidos.'), false);
  }
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

module.exports = uploadImage;
