const app = require('./app');
const config = require('./config/config');

const PORT = config.port || 3000;

if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║         THE READING SOUNDTRACK - Integration Service      ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📖 Web Interface: http://localhost:${PORT}`);
        console.log('\n👉 Ready to process requests!\n');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        server.close(() => process.exit(0));
    });
}

module.exports = app;