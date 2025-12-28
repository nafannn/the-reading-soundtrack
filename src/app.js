const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes/soundtrackRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

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

// API Routes - PRIORITAS PERTAMA
app.use('/api', routes);

// Serve static files untuk semua environment
// Express akan skip ini kalau route sudah match di atas
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all untuk SPA - hanya untuk non-API routes
app.get('*', (req, res, next) => {
    // Skip kalau ini API request
    if (req.url.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

module.exports = app;