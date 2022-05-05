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
const Netclasses = sequelize.define('netsClasses',{
		popup_class_slider: { type: DataTypes.STRING, defaultValue: '' },
		calc_class_slider_desktop: {type: DataTypes.STRING, defaultValue: ''},
		calc_info_class_desktop: {type: DataTypes.STRING, defaultValue: ''},
		calc_class_slider_mobile: {type: DataTypes.STRING, defaultValue: ''},
		nets_class_slider_mobile: {type: DataTypes.STRING, defaultValue: ''},
		nets_info_class_mobile: {type: DataTypes.STRING, defaultValue: ''},
		nets_popup_class_mobile: {type: DataTypes.STRING, defaultValue: ''},
		calc_class_info_mobile: { type: DataTypes.STRING, defaultValue: '' },
		nets_stat_class: { type: DataTypes.STRING, defaultValue: ''},
})

NetCard.hasOne(Netclasses)
Netclasses.belongsTo(NetCard)


module.exports = {
		NetCard,
		Netclasses
}