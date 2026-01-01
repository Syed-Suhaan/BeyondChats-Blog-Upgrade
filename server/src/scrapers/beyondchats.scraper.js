const axios = require('axios');
const cheerio = require('cheerio');
const { connectDB, sequelize } = require('../config/db');
const Article = require('../modules/articles/article.model');
const logger = require('../utils/logger');

const BASE_URL = 'https://beyondchats.com/blogs';

async function fetchPage(url) {
    try {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        logger.error(`Failed to fetch ${url}`, error);
        return null;
    }
}

async function scrapeArticleContent(url) {
    const $ = await fetchPage(url);
    if (!$) return '';

    // Content selector
    const content = $('.entry-content, .post-content, .elementor-widget-theme-post-content').first().html();
    return content || '';
}

async function scrapeOldestArticles() {
    // await connectDB(); // Use existing connection if imported
    logger.info('Starting scrape job...');

    const articlesToScrape = [];

    // Page 15
    logger.info('Fetching Page 15...');
    const $p15 = await fetchPage(`${BASE_URL}/page/15/`);
    if ($p15) {
        const articles = $p15('article').toArray().reverse();


        for (const el of articles) {
            articlesToScrape.push({
                title: $p15(el).find('.entry-title a').text().trim(),
                url: $p15(el).find('.entry-title a').attr('href'),
                date: $p15(el).find('.ct-meta-element-date').text().trim()
            });
        }
    }

    logger.info('Fetching Page 14...');
    const $p14 = await fetchPage(`${BASE_URL}/page/14/`);
    if ($p14) {
        let articles = $p14('article').toArray();

        articles = articles.slice(-4).reverse();

        for (const el of articles) {
            articlesToScrape.push({
                title: $p14(el).find('.entry-title a').text().trim(),
                url: $p14(el).find('.entry-title a').attr('href'),
                date: $p14(el).find('.ct-meta-element-date').text().trim()
            });
        }
    }

    logger.info(`Found ${articlesToScrape.length} articles to process.`);

    // Process
    for (const item of articlesToScrape) {
        const existing = await Article.findOne({ where: { sourceUrl: item.url } });
        if (existing) {
            logger.info(`Skipping existing: ${item.title}`);
            continue;
        }

        logger.info(`Scraping content for: ${item.title}`);
        const content = await scrapeArticleContent(item.url);

        await Article.create({
            title: item.title,
            slug: item.url.split('/').filter(x => x).pop(), // simple slug from url
            sourceUrl: item.url,
            content: content,
            publishedAt: new Date(item.date),
            version: 'original'
        });
        logger.info(`Saved: ${item.title}`);
    }

    logger.info('Scraping completed.');
    // Only close if running as standalone script
    if (require.main === module) {
        await sequelize.close();
    }
}

if (require.main === module) {
    scrapeOldestArticles();
}

module.exports = { scrapeOldestArticles };
