const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: process.env.CACHE_TTL || 300, // Default TTL is 5 minutes
});

module.exports = cache;
