const fetch = require('node-fetch')

const fetchBondedData = async (url) => {
  try {
    let bondedData = await fetch(`${url}/staking/pool`).then(res => res.json()).then(data => data);
    return bondedData
  }catch(e) {
    console.log(e);
  }
}
const fetchDenom = async (url) => {
  try {
    let denom = await fetch(`${url}/staking/parameters`).then(res => res.json()).then(data => data.result.bond_denom)
    return denom
  }catch(e) {
    console.log(e);
  }
}
const fetchSupply = async (url) => {
  try {
    const denom = await fetchDenom(url)
    let supply = await fetch(`${url}/bank/total/${denom}`).then(res => res.json()).then(data => data.result.amount)
    return supply
  }catch(e) {
    console.log(e);
  }
}
const fetchInflation = async (url) => {
  try {
    let inflation = await fetch(`${url}/minting/inflation`)
    .then(res => res.json()).then(data => data.result ? (Number(data.result) * 100).toFixed(2) : null)
    return inflation
  }catch(e) {
    console.log(e);
  }
}
const fetchIBS = async () => {
  try {
    let ibc = await fetch('https://api.mapofzones.com/v1/graphql', {
      method: "POST",
      body: JSON.stringify({
        operationName: "TotalStat",
        query: 'query TotalStat($period: Int!) {\n  headers(where: {timeframe: {_eq: $period}, is_mainnet_only: {_eq: true}}) {\n    ...header\n    }\n}\nfragment header on headers {\n  ibc_cashflow_period\n  ibc_transfers_period}',
        variables: {
          period: 24
        }
      })
    }).then(res => res.json()).then(data => data.data.headers[0])
    return {
      ibc_volume: ibc.ibc_cashflow_period,
      ibc_transfers: ibc.ibc_transfers_period
    }
  }catch(e) {
    console.log(e);
  }
}
const fetchTransactions = async (mintskan_url) => {
  try {
    const transactions = mintskan_url.length ? await fetch(mintskan_url).then(res => res.json()).then(data => data.total_txs_num) : null;
    return transactions
  }catch(e) {
    console.log(e.message);
  }
}
const fetchMarketData = async (coin) => {
  try {
    const coinMarketData = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d,14d`
    ).then(res => res.json()).then(data => data[0])
    return coinMarketData
  }catch(e) {
    console.log(e);
  }
}
const fetchCoin = async (net) => {
  try {
    const coin = await fetch(`https://api.coingecko.com/api/v3/coins/${net.coin}/market_chart?vs_currency=usd&days=1`)
    .then(res => res.json())
    return coin
  }catch(e) {
    console.log(e)
  }
}

module.exports = {
  fetchBondedData, fetchDenom, fetchSupply, fetchInflation, fetchIBS, fetchTransactions, fetchMarketData, fetchCoin
}