const express = require('express');
const { connectDB, sequelize } = require('./config/db');
const logger = require('./utils/logger');
const articleRoutes = require('./modules/articles/article.routes');
require('./modules/articles/article.model'); // Register model

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/articles', articleRoutes);

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync(); // Sync models with DB
        logger.info('Database synced successfully');

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
