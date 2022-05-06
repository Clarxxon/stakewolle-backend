const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || "development"
const config = require('./config/config.json')[env]

// if (config.use_env_variable) {
// 		module.exports = new Sequelize(process.env[config.use_env_variable])
// } else {
// 		module.exports = new Sequelize(config.database, config.username, config.password, config)
// }

module.exports = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		{
				dialect: 'postgres',
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				dialectOptions: {
						ssl: true
				}
		}

)