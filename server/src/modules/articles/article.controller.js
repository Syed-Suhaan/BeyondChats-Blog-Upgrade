const articleService = require('./article.service');
const upgradeEngine = require('../../upgrade-engine/index');
const logger = require('../../utils/logger');

const getArticles = async (req, res) => {
    try {
        const articles = await articleService.getAllArticles();
        res.json(articles);
    } catch (error) {
        logger.error('Error fetching articles', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await articleService.getArticleById(id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.json(article);
    } catch (error) {
        logger.error(`Error fetching article ${req.params.id}`, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getArticleComparison = async (req, res) => {
    try {
        const { slug } = req.params;
        const articles = await articleService.getArticlesBySlug(slug);

        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: 'Articles not found' });
        }

        // Return as object with keys
        const original = articles.find(a => a.version === 'original');
        const enhanced = articles.find(a => a.version === 'enhanced');

        res.json({ original, enhanced });
    } catch (error) {
        logger.error(`Error fetching comparison for slug ${req.params.slug}`, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const enhanceArticle = async (req, res) => {
    try {
        const { id } = req.params;
        // Trigger enhancement (this might take a while, so ideally it should be async/job queue, 
        // but for this MVP we'll await it or return processing)

        logger.info(`Received enhancement request for ID: ${id}`);
        const enhancedArticle = await upgradeEngine.enhanceArticleById(id);

        res.json(enhancedArticle);
    } catch (error) {
        logger.error(`Error enhancing article ${req.params.id}`, error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

module.exports = {
    getArticles,
    getArticle,
    getArticleComparison,
    enhanceArticle,
};
