dweb3 = new Web3('http://127.0.0.1:8545/')
// dweb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')

dweb3.eth.getChainId().then(r => console.log('chain id: '+r))

function formatBalance(bal) {
  return Math.round(bal/Math.pow(10,14))/Math.pow(10,4)
}

ABI_ERC20 = null
$.getJSON("abi/PancakeERC20.json", function(json) {
  ABI_ERC20 = json.abi
})

function approveToken (tokenAddress, spender, cb) {
  if (!tokenAddress) {
    let token = prompt("Please enter token", "USDC")
    let tokenAddress = TOKENS[token]
  }
  
  if (!tokenAddress) {
    alert('Wrong token symbol provided')
    return
  }
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ERC20, tokenAddress)
  // Max approve = 2^256 - 1
  let amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  contract
    .methods
    .approve(spender, amount)
    .send({
      from: selectedAccount
    })
    .then(function(res) {
      cb(null, res)
    })
}

function getBalance(tokenAddress, cb) {
  if (!tokenAddress) {
    let token = prompt("Please enter token", "USDC")
    let tokenAddress = TOKENS[token]
  }
  
  if (!tokenAddress) {
    alert('Wrong token symbol provided')
    return
  }
  let contract = new dweb3.eth.Contract(ABI_ERC20, tokenAddress)
  contract
    .methods
    .balanceOf(selectedAccount)
    .call()
    .then(function(res) {
      cb(null, res)
    })
}

function getAllowance(tokenAddress, owner, spender, cb) {
  let contract = new dweb3.eth.Contract(ABI_ERC20, tokenAddress)
  contract
    .methods
    .allowance(owner, spender)
    .call()
    .then(function(res) {
      cb(null, res)
    })
}