gftPrice = 0
gmtPrice = 0

// get GMT price from coingecko
let url = "https://api.coingecko.com/api/v3/simple/price?ids=stepn&vs_currencies=usd"
$.get(url, function( data ) {
  gmtPrice = data["stepn"]["usd"]

  getGftPrice()
  setInterval(function() {
    getGftPrice()
  }, 10000)
});

function getGftPrice() {
  for (let i = 1; i < POOLS.length; i++) {
    if (POOLS[i].name == "GMT/GFT LP") {
      getReserves(POOLS[i].lpToken, function(err, res) {
        let price = Math.pow(10, 8) * res[0] / res[1]
        gftPrice = price * gmtPrice
        gftPrice = Math.round(gftPrice*Math.pow(10, 6)) / Math.pow(10, 4)
        $('#gft-price').text('1 GFT = '+gftPrice+' USDC')
      })
      break;
    }
  }
}

