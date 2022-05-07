const path = require('path')
const uuid = require('uuid')
const fetch = require('node-fetch');
const { NetCard, Netclasses } = require('../models/models')
const ApiError = require('../error/ApiError')

class NetCardController {
		getClasses(id, current, currentNext) {
				let classes = ''
				if (currentNext) {
						id === 1 ? classes = 'current' : classes = 'next'
				}else if (current) {
						id === 1 ? classes = 'current' : classes= ''
				}else {
						if (id===1) {
								classes = 'left current'
						}else if(id===2) {
								classes ='center'
						} else if (id===3) {
								classes = 'right'
						} else {
								classes = 'next'
						}
				}
				return classes
		}
		async create(req, res, next) {
				try {
						let {
								coin, title, short_title, subtitle, subtitle_en, token,
								stakewolle_comission, kepler_link, pingpub_link, adres, cosmostation,
								bonded_ratio_link,
						} = req.body
						const {img} = req.files
						const filename = uuid.v4() + '.webp'
						img.mv(path.resolve(__dirname, '..', 'static', filename))

						const netCard = await NetCard.create({
								coin, title, short_title, subtitle,
								subtitle_en, token, stakewolle_comission, kepler_link, pingpub_link, adres,
								bonded_ratio_link, cosmostation,  img: filename
						})
						new NetCardController().saveClassNames(netCard.id)

						return res.json(netCard)
				}catch(e) {
						next(ApiError.badRequest(e.message))
				}

		}
		saveClassNames(id) {
				const classesFunc = new NetCardController()
				const classes = classesFunc.getClasses(id)
				const currentClasses = classesFunc.getClasses(id, true)
				const currentNext = classesFunc.getClasses(id, true, true)
				if (id < 7) {
						id = `0${id}`
				}
				Netclasses.create({
						popup_class_slider: `nets-popup__top-slider__wrapper-item ${classes}`,
						calc_class_slider_desktop: `calculator-wrapper__item _${id} ${currentClasses}`,
						calc_info_class_desktop: `calculator-wrapper__info ${currentClasses}`,
						calc_class_slider_mobile: `mobile-calculator__top-item ${classes}`,
						nets_class_slider_mobile: `mobile-stacking__slider-top__item ${classes}`,
						nets_info_class_mobile: `mobile-stacking__slider-info__item ${currentClasses}`,
						nets_popup_class_mobile: `nets-popup__top-slider__wrapper-item ${currentNext}`,
						calc_class_info_mobile: `mobile-calculator__info-item ${currentClasses}`,
						nets_stat_class: `nets-popup__stat ${currentClasses}`,
						netCardId: id
				})
		}
		async getAll(req, res, next) {
				let {limit, page} = req.query
				limit = limit || 4;
				page = page || 1;
				let offset = page * limit - limit
				try {
						const nets = await NetCard.findAll(
								{
										limit,
										offset,
										include: [{model: Netclasses}]
								}
						)
						let handleNets = []
						for(let net of nets) {
								const {
										week_data,
										price_dynamics, fee,
										price, market_cap,
										price_change_percentage
								} = await new NetCardController().getParams(net)

								let bondedData = await fetch(`${net.bonded_ratio_link}/staking/pool`)
								.then(res => res.json()).then(data => data)

								let denom = await fetch(`${net.bonded_ratio_link}/staking/parameters`)
								.then(res => res.json()).then(data => data.result.bond_denom)

								let supply = await fetch(`${net.bonded_ratio_link}/bank/total/${denom}`)
								.then(res => res.json()).then(data => data.result.amount)

								let inflation = await fetch(`${net.bonded_ratio_link}/minting/inflation`)
								.then(res => res.json()).then(data => (Number(data.result) *  100).toFixed(2))

								const bonded = Number(bondedData.result.not_bonded_tokens) + Number(bondedData.result.bonded_tokens)

								const bonded_ratio = bonded / Number(supply)
								const annual_comission = ((1 / bonded_ratio) * inflation).toFixed(2)
								handleNets.push({
										...net.toJSON(),
										inflation, annual_comission,
										week_data,
										price_dynamics, fee,
										price, market_cap,
										price_change_percentage,
										img: `${process.env.HOST_URL}/${net.img}`
								})
						}

						res.json(handleNets)
				}catch(e) {
						next(ApiError.badRequest(e.message))
				}
		}
		async getParams(net) {
				let coinArray = []
				let week_data = []
				let price_dynamics = false;
				const round = new NetCardController().round

				const coin = await fetch(`https://api.coingecko.com/api/v3/coins/${net.coin}/market_chart?vs_currency=usd&days=1`)
				.then(res => res.json())
				const coinMarketData = await fetch(
						`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${net.coin}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
				).then(res => res.json()).then(data => data[0])

				for (let k = coin.prices.length-1; k >= 12; k-=12){
						coinArray.push(coin.prices[k][1])
						week_data = coinArray.reverse()
				}
				const fee = round(round(coinArray.reverse()[coinArray.length-1]) - round(coinArray.reverse()[coinArray.length-2]))
				let price = coinMarketData.current_price
				const market_cap = coinMarketData.market_cap
				const price_change_percentage = coinMarketData.price_change_percentage_24h
				if(price_change_percentage >= 0){
						price_dynamics = true
				}

				if (`${price}`.includes('e')) {
						price = price.toFixed(12)
				}

				return {
						week_data, price_dynamics, fee, price, market_cap, price_change_percentage
				}
		}
		round(number){
				return Number(number).toFixed(4);
		}
}

module.exports = new NetCardController()