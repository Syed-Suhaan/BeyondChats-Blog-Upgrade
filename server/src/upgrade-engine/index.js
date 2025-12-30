const { connectDB, sequelize } = require('../config/db');
const Article = require('../modules/articles/article.model');
const searchClient = require('./search.client');
const contentScraper = require('./content.scraper');
const llmClient = require('./llm.client');
const logger = require('../utils/logger');

const enhanceArticleById = async (id) => {
    // Determine Article ID
    const original = await Article.findByPk(id);

    if (!original) {
        throw new Error('Original article not found.');
    }

    if (original.version !== 'original') {
        throw new Error('Cannot enhance an already enhanced article.');
    }

    // Check for existing enhanced version
    const exists = await Article.findOne({
        where: {
            slug: original.slug + '-enhanced',
            version: 'enhanced'
        }
    });

    if (exists) {
        // Simulated delay for UX
        logger.info(`Article "${original.title}" already enhanced. Waiting 5s for demo...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return exists;
    }

    logger.info(`Starting upgrade for: "${original.title}"`);

    // Extract keyword
    const keyword = await llmClient.extractKeywords(original.title);
    logger.info(`Identified Keyphrase: ${keyword}`);

    // Google search
    const searchResults = await searchClient.searchGoogle(keyword);
    const competitorLinks = searchResults.map(r => r.link);

    // Scrape content
    const competitors = await contentScraper.scrapeCompetitors(competitorLinks, 3);
    if (competitors.length === 0) {
        logger.warn('No competitor content found. Aborting enhancement.');
        throw new Error('No competitor content found.');
    }

    // Enhance content
    const enhancedContent = await llmClient.enhanceArticle(original.content, competitors);

    if (!enhancedContent) {
        logger.error('LLM returned empty content.');
        throw new Error('LLM enhancement failed.');
    }

    // Save article
    logger.info('Saving enhanced version...');
    const enhancedArticle = await Article.create({
        title: original.title + ' (Updated)',
        slug: original.slug + '-enhanced',
        sourceUrl: original.sourceUrl,
        content: enhancedContent,
        publishedAt: new Date(),
        version: 'enhanced',
        references: competitors.map(c => c.url)
    });

    logger.info('Upgrade Complete!');

    // Artificial delay for UX (5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));

    return enhancedArticle;
};

// Kept for backward compatibility if needed, or manual batch runs
const runUpgradeProcess = async () => {
    await connectDB();
    const original = await Article.findOne({
        where: { version: 'original' },
        order: sequelize.random()
    });

    if (!original) {
        logger.info('No original articles found.');
        return;
    }

    try {
        await enhanceArticleById(original.id);
    } catch (error) {
        logger.error(error.message);
    } finally {
        await sequelize.close();
    }
};

if (require.main === module) {
    runUpgradeProcess();
}

module.exports = { enhanceArticleById, runUpgradeProcess };
