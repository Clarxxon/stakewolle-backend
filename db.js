const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production'
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

module.exports = new Sequelize(
		isProduction
				? process.env.DATABASE_URL
				: connectionString,
		ssl: isProduction

)