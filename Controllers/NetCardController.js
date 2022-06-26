const fetch = require('node-fetch');
const ApiError = require('../error/ApiError')
const netCardService = require('../services/netCardService')

const { fetchIBS, fetchTransactions } = require('../http/QueriesApi')

class NetCardController {
		async getAll(req, res, next) {
			let {limit, page} = req.query
			try {
				limit = limit || 4;
				page = page || 1;
				let offset = page * limit - limit
				const nets = await fetch(`${process.env.ADMIN_ROUTE}/nets?_start=${offset}&_limit=${limit}&_sort=id`).then(res => res.json())
				const handleNets = await netCardService.getNetCards(nets)
				await res.json(handleNets)
			}catch(e) {
				console.log(e);
				next(ApiError.badRequest(e.message))
			}
		}
		async getOne(req, res, next) {
			const { id } = req.params
			try {
				let netItem = await fetch(`${process.env.HEROKU_ADMIN_ROUTE}/nets-plural/${id}?populate=*`).then(res => res.json()).then(data => data.data)
				netItem = { id: netItem.id, ...netItem.attributes }
				const handleNetItem = await netCardService.getNetCards([netItem])
				await res.json(handleNetItem)
			}catch(e) {
				console.log(e);
				next(ApiError.badRequest(e.message))
			}
		}
		async getMoreData(req, res, next) {
			const { id } = req.params
			const netItem = await fetch(`https://stakewolle-admin.herokuapp.com/api/nets-plural/${id}`).then(res => res.json())
			const { ibc_volume, ibc_transfers } = await fetchIBS()
			const transactions = await fetchTransactions(netItem.data.attributes.mintskan)
			const result = { ibc_volume, ibc_transfers, transactions }
			res.json(result)
		}
}

module.exports = new NetCardController()
