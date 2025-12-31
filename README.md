# BeyondChats Blog Upgrade System

Automated system to ingest, enhance, and display blog content using AI.

## Features
*   **Ingestion**: Scrapes articles from BeyondChats using a custom scraper.
*   **Enhancement**: Upgrades content using **Llama-3 (Groq)** and real-time competitor research (**Serper/Google**).
*   **Visualization**: React dashboard to compare Original vs. Enhanced versions.

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend**: Node.js, Express, Sequelize (PostgreSQL)
*   **AI/Tools**: Groq SDK, Serper.dev, Cheerio

## Setup
1.  Clonse the repo.
2.  **Backend**: `cd server` -> `npm install` -> `npm start`
3.  **Frontend**: `cd client` -> `npm install` -> `npm run dev`

## Environment Variables (.env)
*   `GROQ_API_KEY`: AI Model key.
*   `SERPER_API_KEY`: Google Search key.
*   `DATABASE_URL`: PostgreSQL connection string.
