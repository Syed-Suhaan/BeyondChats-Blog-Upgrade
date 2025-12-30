const Groq = require('groq-sdk');
const logger = require('../utils/logger');
require('dotenv').config();

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const enhanceArticle = async (originalContent, competitorContents) => {
    try {
        const competitorsText = competitorContents
            .map((c, i) => `Competitor ${i + 1} (${c.url}):\n${c.content.substring(0, 3000)}`)
            .join('\n\n');

        const prompt = `
    You are an expert content editor and SEO specialist.
    Your task is to significantly improve a blog article based on competitor content.
    
    ORIGINAL ARTICLE:
    ${originalContent.substring(0, 5000)}
    
    COMPETITOR CONTENT (For research/inspiration):
    ${competitorsText}
    
    INSTRUCTIONS:
    1. Write a completely new, enhanced version of the article.
    2. Make it longer, more detailed, and more engaging than the original.
    3. Incorporate key insights from competitors without plagiarizing.
    4. Maintain the original core message but elevate the quality.
    5. Return ONLY the HTML content (start with <h1>, use <h2>, <p>, <ul> etc).
    `;

        logger.info('Sending request to Groq LLM...');

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a professional blog editor.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        logger.error('LLM Enhancement failed', error);
        throw error;
    }
};

const extractKeywords = async (title) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: `Extract the main SEO keyword from this title: "${title}". Return ONLY the keyword, nothing else.` }
            ],
            model: 'llama-3.3-70b-versatile',
        });
        return completion.choices[0]?.message?.content?.trim() || title;
    } catch (error) {
        logger.warn('Keyword extraction failed, using title', error);
        return title;
    }
};

module.exports = { enhanceArticle, extractKeywords };
