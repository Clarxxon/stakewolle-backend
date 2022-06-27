const fetch = require('node-fetch');
const ApiError = require('../error/ApiError')
const netCardService = require('../services/netCardService')

const { fetchIBS, fetchTransactions, refreshDb } = require('../http/QueriesApi')

class NetCardController {
		async getAll(req, res, next) {
			let {limit, page} = req.query
			try {
				limit = limit || 10;
				page = page || 1;
				let offset = page * limit - limit
				const nets = await fetch(`${process.env.ADMIN_ROUTE}/nets?_start=${offset}&_limit=${limit}&_sort=id`).then(res => res.json())
				for (let item in nets) {
					nets[item].week_data = Object.values(nets[item].week_data)
				}
				await res.json(nets)
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
		async refresh() {
			try {
				let nets = await fetch(`${process.env.ADMIN_ROUTE}/nets?_sort=id`)
				nets = await nets.json()
				const handleNets = await netCardService.getNetCards(nets)
				handleNets.forEach(async item => {
					await refreshDb(item)
				})
			}catch(e) {
				console.log(e);
			}
		}
}

module.exports = new NetCardController()
