
gftPrice = 0;
gmtPrice = 0;
supply = 0;
marketcap = 0;
holders = 0;
sumTvl = 0;
tvl = [];

fetchApi()

function renderStats () {
  $('#gft-price').text('1 GFT = '+gftPrice+' USDC');
  $('#total-tvl').text(`$${numberWithCommas(sumTvl / Math.pow(10,18))}`)
  $('#supply').text(numberWithCommas(supply, 0))
  $('#mcap').text(`$${numberWithCommas(marketcap)}`)
  $('#holders').text(holders)
}


function fetchApi () {
  console.log('Fetching from api..')
  fetch(`https://api.stepfarm.io/stats`).then(res => res.json())
  .then(result => {
  	// console.log(result)
    gftPrice = result.gftPrice;
    gmtPrice = result.gmtPrice;
    supply = result.supply;
    marketcap = result.marketcap;
    holders = result.holders;
    sumTvl = result.sumTvl;
    tvl = result.tvl;
    renderStats()
  })
  .catch((e) => {
  	console.error(e)
  	console.log("API error, contact devs")
  })
}