const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Environment Variables Loaded:', Object.keys(process.env));
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 5) : 'UNDEFINED');


if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is missing in environment variables!");
  process.exit(1);
}

const rawDbUrl = process.env.DATABASE_URL;
const dbUrl = rawDbUrl.replace(/^['"]|['"]$/g, '');

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
