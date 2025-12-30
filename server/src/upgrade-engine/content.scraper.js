const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

const axiosInstance = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
});

const scrapeUrl = async (url) => {
    try {
        const { data } = await axiosInstance.get(url);
        const $ = cheerio.load(data);

        // Remove scripts, styles, etc
        $('script, style, nav, footer, header').remove();

        // Get main text
        // Try standard article selectors first, fallback to body
        let content = $('article').text().trim();
        if (content.length < 500) {
            content = $('main').text().trim();
        }
        if (content.length < 500) {
            content = $('body').text().trim();
        }

        // Clean up whitespace
        return content.replace(/\s+/g, ' ').substring(0, 15000); // Limit length for context window
    } catch (error) {
        logger.warn(`Failed to scrape ${url}: ${error.message}`);
        return null;
    }
};

const scrapeCompetitors = async (links, limit = 3) => {
    const scrapedData = [];

    for (const link of links) {
        if (scrapedData.length >= limit) break;

        logger.info(`Scraping competitor: ${link}`);
        const content = await scrapeUrl(link);

        if (content && content.length > 500) { // arbitrary quality threshold
            scrapedData.push({ url: link, content });
        }
    }

    return scrapedData;
};

module.exports = { scrapeCompetitors };
