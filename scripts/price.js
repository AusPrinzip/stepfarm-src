function getGftPrice() {
  for (let i = 1; i < POOLS.length; i++) {
    if (POOLS[i].name == "USDC/GFT LP") {
      getReserves(POOLS[i].lpToken, function(err, res) {
        let price = res[0] / res[1]
        price = Math.round(price*Math.pow(10, 6)) / Math.pow(10, 6)
        $('#gft-price').text('1 GFT = '+price+' USDC')
      })
      break;
    }
  }
}

setInterval(function() {
  getGftPrice()
}, 10000)