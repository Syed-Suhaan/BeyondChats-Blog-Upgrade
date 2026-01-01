const express = require('express');
const articleController = require('./article.controller');

const router = express.Router();

router.post('/seed', articleController.seedArticles);
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticle);
router.post('/:id/enhance', articleController.enhanceArticle);
router.get('/compare/:slug', articleController.getArticleComparison);

module.exports = router;
