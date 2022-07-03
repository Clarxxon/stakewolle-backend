const fetch = require('node-fetch');
const cardParamsService = require('./cardParamsService')
const { fetchBondedData, fetchSupply, fetchInflation } = require('../http/QueriesApi')

class netCardService {
		async getNetCards(nets) {
			let handleNets = []
			for (let net of nets) {
				const params = await cardParamsService.getParams(net)

				const url = net.bonded_ratio_link
				const bondedData = await fetchBondedData(url);
				const supply = await fetchSupply(url);
				const inflation = await fetchInflation(url);

				const bonded = Number(bondedData.result.not_bonded_tokens) + Number(bondedData.result.bonded_tokens)

				const bonded_ratio = bonded / Number(supply)
				const annual_comission = ((1 / bonded_ratio) * inflation).toFixed(2)
				handleNets.push({
						id: net.id,
						...net,
						inflation, annual_comission, bonded_ratio,
						...params,
				})
		  }
			return handleNets
		}
}

module.exports = new netCardService()
