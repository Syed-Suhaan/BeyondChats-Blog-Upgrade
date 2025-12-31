import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

export const getArticles = async () => {
    const response = await api.get('/articles');
    return response.data;
};

export const getArticleComparison = async (slug) => {
    const response = await api.get(`/articles/compare/${slug}`);
    return response.data;
};

export const enhanceArticle = async (id) => {
    const response = await api.post(`/articles/${id}/enhance`);
    return response.data;
};

export const getArticleById = async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
};

export default api;
