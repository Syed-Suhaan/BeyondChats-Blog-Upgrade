const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    sourceUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    version: {
        type: DataTypes.ENUM('original', 'enhanced'),
        defaultValue: 'original',
    },
    references: {
        type: DataTypes.JSONB, // Stores array of links/citations
        defaultValue: [],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

module.exports = Article;
