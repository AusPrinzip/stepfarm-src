
 gftPrice = 0;
 gmtPrice = 0;

fetchApi()

function fetchApi () {
  console.log('Fetching from api..')
  fetch(`https://api.stepfarm.io/stats`).then(res => res.json())
  .then(result => {
  	console.log("result")
    gftPrice = result.gftPrice;
    gmtPrice = result.gmtPrice;
    $('#gft-price').text('1 GFT = '+gftPrice+' USDC');
    $('#total-tvl').text(`$${numberWithCommas(result.sumTvl / Math.pow(10,18))}`)
    $('#supply').text(numberWithCommas(result.supply, 0))
    $('#mcap').text(`$${numberWithCommas(result.marketcap)}`)
    $('#holders').text(result.holders)

    const counters = 4;
    const firstCounter = document.querySelector('.counter1')
    for (let i = 1; i <= counters; i++) {
      const el = document.querySelector(`.counter${i}`);
      const counterUp = window.counterUp.default;
      new Waypoint( {
          element: firstCounter,
          handler: function() { 
              counterUp(el, { duration: 3000, delay: 16 }) 
              this.destroy()
          },
          offset: '80%',
      })
    }

  })
  .catch(e => console.log("API error, contact devs"))
}