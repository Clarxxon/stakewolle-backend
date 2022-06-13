const fetch = require('node-fetch');
const ApiError = require('../error/ApiError')
const netCardService = require('../services/netCardService')

const { fetchIBS, fetchTransactions } = require('../http/QueriesApi')

class NetCardController {
		// async create(req, res, next) {
		// 	try {
		// 		let {
		// 			coin, title, short_title, subtitle, subtitle_en, token,
		// 			stakewolle_comission, kepler_link, pingpub_link, adres, cosmostation,
		// 			bonded_ratio_link,
		// 		} = req.body
		// 		const {img} = req.files
		// 		const filename = uuid.v4() + '.webp'
		// 		img.mv(path.resolve(__dirname, '..', 'static', filename))

		// 		const netCard = await NetCard.create({
		// 			coin, title, short_title, subtitle,
		// 			subtitle_en, token, stakewolle_comission, kepler_link, pingpub_link, adres,
		// 			bonded_ratio_link, cosmostation,  img: filename
		// 		})
		// 		return res.json(netCard)
		// 	}catch(e) {
		// 		next(ApiError.badRequest(e.message))
		// 	}
		// }
		async getAll(req, res, next) {
			let {limit, page} = req.query
			limit = limit || 4;
			page = page || 1;
			try {
				const nets = await fetch(`${process.env.ADMIN_ROUTE}/api/nets-plural?pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`).then(res => res.json())
				const handleNets = await netCardService.getNetCards(nets.data)
				await res.json({
					nets: handleNets,
					count: nets.meta.pagination.total
				})
			}catch(e) {
				console.log(e);
				next(ApiError.badRequest(e.message))
			}
		}
		async getMoreData(req, res, next) {
			const { id } = req.params
			const netItem = await fetch(`https://stakewolle-adminpanel.herokuapp.com/api/nets-table-plural/${id}`).then(res => res.json())
			const { ibc_volume, ibc_transfers } = await fetchIBS()
			const transactions = await fetchTransactions(netItem.data.attributes.mintskan)
			const result = { ibc_volume, ibc_transfers, transactions }
			res.json(result)
		}
}

module.exports = new NetCardController()