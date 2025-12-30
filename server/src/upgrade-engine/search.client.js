const axios = require('axios');
const logger = require('../utils/logger');

const searchGoogle = async (query) => {
    try {
        const apiKey = process.env.SERPER_API_KEY;
        if (!apiKey) {
            logger.error('SERPER_API_KEY is missing in .env');
            return [];
        }

        logger.info(`Searching Google (via Serper.dev): "${query}"`);

        const { data } = await axios.post(
            'https://google.serper.dev/search',
            { q: query, num: 10 },
            {
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        const results = [];
        if (data.organic) {
            // Map Serper's "organic" results to our format
            data.organic.forEach(item => {
                if (item.title && item.link) {
                    results.push({
                        title: item.title,
                        link: item.link,
                        snippet: item.snippet || ''
                    });
                }
            });
        }

        logger.info(`Found ${results.length} results.`);
        return results;

    } catch (error) {
        if (error.response) {
            logger.error(`Serper search failed: ${error.response.status} - ${error.response.statusText}`);
        } else {
            logger.error('Serper search failed', error);
        }
        return [];
    }
};

module.exports = { searchGoogle };
