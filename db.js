const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production'

module.exports = new Sequelize(
		isProduction
				? process.env.DATABASE_URL
				:
		process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		{
				dialect: 'postgres',
				host: process.env.DB_HOST,
				port: process.env.DB_PORT
		}

)