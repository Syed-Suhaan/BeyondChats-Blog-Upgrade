require('dotenv').config({ path: '../../.env' }); // Adjust path to root .env
const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing");
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

const Article = sequelize.define('Article', {
    version: {
        type: Sequelize.ENUM('original', 'enhanced')
    }
});

const clean = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');
        const count = await Article.destroy({
            where: { version: 'enhanced' }
        });
        console.log(`Deleted ${count} enhanced articles.`);
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await sequelize.close();
    }
};

clean();
