const Article = require('./article.model');

const getAllArticles = async () => {
    return await Article.findAll({
        where: { version: 'original' },
        order: [['publishedAt', 'ASC']], // Oldest first
    });
};

const getArticleById = async (id) => {
    return await Article.findByPk(id);
};

const getArticlesBySlug = async (slug) => {
    const { Op } = require('sequelize');
    const baseSlug = slug.replace(/-enhanced$/, '');
    return await Article.findAll({
        where: {
            slug: {
                [Op.or]: [baseSlug, `${baseSlug}-enhanced`]
            }
        },
        order: [['version', 'DESC']],
    });
};

module.exports = {
    getAllArticles,
    getArticleById,
    getArticlesBySlug,
};
