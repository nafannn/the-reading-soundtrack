require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,

    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp', // Default model
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
    const errorMsg = `MISSING CONFIG: ${missing.map(m => m.env).join(', ')}`;
    console.error(errorMsg);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
}

module.exports = config;
