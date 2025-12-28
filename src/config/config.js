require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,

    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    },

    bookApi: {
        baseUrl: process.env.BOOK_API_BASE_URL,
        apiKey: process.env.BOOK_API_KEY,
    },

    musicApi: {
        baseUrl: process.env.MUSIC_API_BASE_URL,
        apiKey: process.env.MUSIC_API_KEY,
    },
};

// Validation
const requiredConfigs = [
    { key: 'gemini.apiKey', env: 'GEMINI_API_KEY' },
    { key: 'bookApi.baseUrl', env: 'BOOK_API_BASE_URL' },
    { key: 'bookApi.apiKey', env: 'BOOK_API_KEY' },
    { key: 'musicApi.baseUrl', env: 'MUSIC_API_BASE_URL' },
    { key: 'musicApi.apiKey', env: 'MUSIC_API_KEY' }
];

const missing = requiredConfigs.filter(conf => {
    const value = conf.key.split('.').reduce((o, i) => o[i], config);
    return !value;
});

if (missing.length > 0) {
    const errorMsg = `⚠️  MISSING ENVIRONMENT VARIABLES: ${missing.map(m => m.env).join(', ')}`;
    console.error(errorMsg);
    
    // Jangan exit di production/Vercel - biarkan error muncul di dashboard
    // Hanya exit saat development lokal
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
        console.error('❌ Application cannot start without required configuration.');
        process.exit(1);
    } else {
        // Di production, log warning tapi tetap jalan
        console.warn('⚠️  Application starting with missing configuration. Errors may occur.');
    }
}

module.exports = config;