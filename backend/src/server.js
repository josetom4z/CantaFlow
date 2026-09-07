require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerSpec');

const authRoutes = require('./routes/auth.routes');
const songRoutes = require('./routes/songs.routes');
const folderRoutes = require('./routes/folders.routes');
const churchRoutes = require('./routes/churches.routes');
const adRoutes = require('./routes/ads.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const uploadsAudioDir = path.join(__dirname, '../uploads/audio');
const uploadsImagesDir = path.join(__dirname, '../uploads/images');

[uploadsDir, uploadsAudioDir, uploadsImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-plan'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded audio and image files with open CORS
app.use('/uploads', cors(), express.static(uploadsDir));
app.use('/uploads/audio', cors(), express.static(uploadsAudioDir));
app.use('/uploads/images', cors(), express.static(uploadsImagesDir));

// Swagger OpenAPI Documentation
const swaggerCustomOptions = {
  customCss: `
    body { background-color: #090a0f !important; color: #e2e8f0 !important; font-family: system-ui, sans-serif !important; }
    .swagger-ui .topbar { background-color: #11131f !important; border-bottom: 1px solid rgba(139,92,246,0.3) !important; }
    .swagger-ui .topbar .topbar-wrapper img { content: url('https://img.icons8.com/fluency/48/musical-notes.png') !important; width: 36px; }
    .swagger-ui .info .title { color: #c4b5fd !important; font-weight: 800; }
    .swagger-ui .info p, .swagger-ui .info li { color: #cbd5e1 !important; }
    .swagger-ui .scheme-container { background: #11131f !important; border: 1px solid rgba(255,255,255,0.08) !important; }
    .swagger-ui .opblock { border-radius: 12px !important; border: 1px solid rgba(255,255,255,0.08) !important; background: #11131f !important; }
    .swagger-ui .opblock .opblock-summary { border-radius: 12px; }
    .swagger-ui .opblock.opblock-get { border-color: #06b6d4 !important; background: rgba(6,182,212,0.06) !important; }
    .swagger-ui .opblock.opblock-post { border-color: #8b5cf6 !important; background: rgba(139,92,246,0.06) !important; }
    .swagger-ui .opblock.opblock-put { border-color: #f59e0b !important; background: rgba(245,158,11,0.06) !important; }
    .swagger-ui .opblock.opblock-delete { border-color: #ef4444 !important; background: rgba(239,68,68,0.06) !important; }
    .swagger-ui .opblock .opblock-summary-path { color: #f8fafc !important; }
    .swagger-ui .opblock .opblock-summary-description { color: #94a3b8 !important; }
    .swagger-ui section.models { background: #11131f !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 12px; }
    .swagger-ui section.models h4 { color: #a78bfa !important; }
  `,
  customSiteTitle: 'CantaFlow API Docs — by PixelLab',
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerCustomOptions));
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/churches', churchRoutes);
app.use('/api/ads', adRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CantaFlow — by PixelLab Backend API',
    time: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('CantaFlow API — by PixelLab is running. Access /api/health or /api/churches');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Rota ${req.originalUrl} não encontrada no servidor CantaFlow.` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('[CantaFlow Server Error]:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor CantaFlow.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[CantaFlow] Backend API by PixelLab running on http://localhost:${PORT}`);
});

module.exports = app;
