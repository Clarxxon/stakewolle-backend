const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const NetCard = sequelize.define('net-card', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	coin: { type: DataTypes.STRING, unique: true, allowNull: false },
	img: { type: DataTypes.STRING, allowNull: false },
	title: { type: DataTypes.STRING, allowNull: false },
	short_title: { type: DataTypes.STRING, allowNull: false },
	subtitle: { type: DataTypes.STRING, allowNull: false },
	subtitle_en: { type: DataTypes.STRING, allowNull: false },
	token: { type: DataTypes.STRING, allowNull: false },
	stakewolle_comission: { type: DataTypes.STRING, defaultValue: '' },
	kepler_link: { type: DataTypes.STRING, defaultValue: '-' },
	pingpub_link: { type: DataTypes.STRING, defaultValue: '-' },
	coingecko_status: { type: DataTypes.BOOLEAN, defaultValue: true },
	adres: { type: DataTypes.STRING, defaultValue: '' },
	cosmostation: { type: DataTypes.STRING, defaultValue: '-' },
	bonded_ratio_link: { type: DataTypes.STRING, defaultValue: '-' }
})

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true, allowNull: false },
	password: { type: DataTypes.STRING, allowNull: false }
})

const Roles = sequelize.define('roles', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	roles: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ['USER'] }
})

User.hasOne(Roles)
Roles.belongsTo(User)

module.exports = {
	NetCard, User, Roles
}