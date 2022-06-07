const fetch = require('node-fetch');
const cardParamsService = require('./cardParamsService')
const { fetchBondedData, fetchSupply, fetchInflation } = require('../http/QueriesApi')

class netCardService {
		async getNetCards(nets) {
				let handleNets = []
				for (let net of nets) {
						const {
							week_data, price_dynamics, fee, price, market_cap,
							price_change_percentage_24h,
							price_change_7d, price_change_14d, rank, circulating, token
						} = await cardParamsService.getParams(net)

						const url = net.attributes.bonded_ratio_link
						const bondedData = await fetchBondedData(url);
						const supply = await fetchSupply(url);
						const inflation = await fetchInflation(url);

						const bonded = Number(bondedData.result.not_bonded_tokens) + Number(bondedData.result.bonded_tokens)

						const bonded_ratio = bonded / Number(supply)
						const annual_comission = ((1 / bonded_ratio) * inflation).toFixed(2)
						handleNets.push({
								id: net.id,
								...net.attributes,
								inflation, annual_comission,
								week_data, price_dynamics, fee, price,
								market_cap, price_change_percentage_24h,
								price_change_7d, price_change_14d,
								rank, circulating, token,
								bonded_ratio,
								img: `${`https://stakewolle-adminpanel.herokuapp.com${net.attributes.img.data.attributes.url}`}`,
						})
		  }
				return handleNets
		}
}

module.exports = new netCardService()