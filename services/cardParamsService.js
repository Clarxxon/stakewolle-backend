const fetch = require('node-fetch');
const { fetchCoin, fetchMarketData } = require('../http/QueriesApi')

function round(number){
		return Number(number).toFixed(4);
}

class cardParamsService {
		async getParams(net) {
				let coinArray = []
				let week_data = []
				let price_dynamics = false;

				const coin = await fetchCoin(net)
				const coinMarketData = await fetchMarketData(net.attributes.coin)

				for (let k = coin.prices.length-1; k >= 12; k-=12){
						coinArray.push(coin.prices[k][1])
						week_data = coinArray.reverse()
				}
				const fee = round(round(coinArray.reverse()[coinArray.length-1]) - round(coinArray.reverse()[coinArray.length-2]))
				const price = coinMarketData.current_price
				const market_cap = coinMarketData.market_cap
				const price_change_percentage_24h = coinMarketData.price_change_percentage_24h
				const price_change_7d = coinMarketData.price_change_percentage_7d_in_currency
				const price_change_14d = coinMarketData.price_change_percentage_14d_in_currency
				const rank = coinMarketData.market_cap_rank ? coinMarketData.market_cap_rank : 'N/A'
				const circulating = coinMarketData.circulating_supply
				const token = coinMarketData.symbol
				if(price_change_percentage_24h >= 0){
						price_dynamics = true
				}

				if (`${price}`.includes('e')) {
						price = price.toFixed(12)
				}

				return {
					week_data, price_dynamics, fee, price, market_cap, price_change_percentage_24h,
					price_change_7d, price_change_14d, rank, circulating, token
				}
		}
}
module.exports = new cardParamsService()