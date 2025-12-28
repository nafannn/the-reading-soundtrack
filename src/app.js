const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes/soundtrackRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
}));

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - Status: ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// ⭐ API ROUTES - HARUS DIDAHULUKAN SEBELUM STATIC FILES!
app.use('/api', routes);

// Serve static files (frontend)
// Di Vercel, static files otomatis di-serve dari folder /public
// Jadi middleware ini hanya aktif untuk development lokal
if (!process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, '../public')));
    
    // Fallback untuk SPA routing (semua non-API routes ke index.html)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}

// 404 handler untuk API endpoints
app.use('/api/*', notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;