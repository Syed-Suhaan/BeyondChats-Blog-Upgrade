const { searchGoogle } = require('./search.client');
const axios = require('axios');
const fs = require('fs');

const test = async () => {
    // We import the same logic or just run the client which uses the client logic
    // But to debug the specific axios call, let's just modify the client temporarily or mock it.
    // Actually, let's just modify the search client to save the file if needed.

    // Or we can just use the searchGoogle function which logs.
    // But it doesn't give me the HTML.

    // I will write a standalone script here that replicates the client logic EXACTLY 
    // and saves the file.

    console.log('--- Debugging Google Search ---');
    try {
        const query = "chatbots for business";
        const { data } = await axios.get('https://www.google.com/search', {
            params: {
                q: query,
                gbv: '1',
                num: 10,
                hl: 'en',
                gl: 'us'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com/',
                'Cookie': 'CONSENT=YES+US.en+20210101-00-0'
            }
        });

        fs.writeFileSync('google_debug.html', data);
        console.log('Saved google_debug.html');

    } catch (e) {
        console.error(e);
    }
};

test();
