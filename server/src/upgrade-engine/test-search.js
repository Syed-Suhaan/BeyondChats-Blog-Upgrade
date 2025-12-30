const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { searchGoogle } = require('./search.client');
const { search } = require('google-sr');

const test = async () => {
    console.log('--- Testing Raw Output ---');
    try {
        const raw = await search({ query: 'chatbots for business' });
        console.log('Raw results type:', typeof raw);
        console.log('Raw results length:', raw ? raw.length : 'null');
        if (raw && raw.length > 0) {
            console.log('First result sample:', raw[0]);
        }
    } catch (e) {
        console.error('Raw Search Error:', e);
    }

    console.log('\n--- Testing Client Wrapper ---');
    const results = await searchGoogle('chatbots for business');
    console.log('Wrapper results:', results);
};

test();
