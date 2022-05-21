dweb3 = new Web3('http://127.0.0.1:8545/')
// dweb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')

dweb3.eth.getChainId().then(r => console.log('chain id: '+r))

ABI_ERC20 = null
$.getJSON("abi/PancakeERC20.json", function(json) {
  ABI_ERC20 = json.abi
})