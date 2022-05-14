

window.addEventListener('load', function () {
  const counters = 4;
  for (let i = 1; i <= counters; i ++) {
    const el = document.querySelector(`.counter${i}`);
    const counterUp = window.counterUp.default;
    new Waypoint( {
        element: el,
        handler: function() { 
            counterUp( el ) 
            this.destroy()
        },
        offset: 'bottom-in-view',
    } )
  }
})

const ONE_MINUTE = 60
const ZEROES = '000000000000000000'
const ADDRESS_FACTORY = '0x5ec0E123A543E6A114c354A4eB09466f6b800A1B'
const ADDRESS_ROUTER = '0xC4C90933E90a7A7f9D70c70D1179c41Ba3e5d1ed'
const TOKENS = {
  USDC: '0x64544969ed7ebf5f083679233325356ebe738930',
  USDT: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
  TEST: '0x39946E6A569ce2D1344B546111669F3AC62233f2'
}
const SLIPPAGE_TOLERANCE = 0.005
let dweb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
dweb3.eth.getChainId().then(r => console.log('chain id: '+r))

let ABI_FACTORY = null
$.getJSON("abi/PancakeFactory.json", function(json) {
  ABI_FACTORY = json.abi
})

let ABI_ROUTER = null
$.getJSON("abi/PancakeRouter.json", function(json) {
  ABI_ROUTER = json.abi
})

let ABI_ERC20 = null
$.getJSON("abi/PancakeERC20.json", function(json) {
  ABI_ERC20 = json.abi
})

let ABI_PAIR = null
$.getJSON("abi/PancakePair.json", function(json) {
  ABI_PAIR = json.abi
})

function getReserves() {
  let contract = new dweb3.eth.Contract(ABI_PAIR, TOKENS["TEST"])
  contract
    .methods
    .getReserves()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function getKLast() {
  let contract = new dweb3.eth.Contract(ABI_PAIR, TOKENS["TEST"])
  contract
    .methods
    .kLast()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function getFactoryAddress() {
  let contract = new dweb3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  contract
    .methods
    .factory()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function getFeeTo () {
  let web3 = new Web3(provider)
  let contract = new dweb3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .feeTo()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function setFeeTo () {
  let treasury = prompt("Please enter treasury address", "0x0000000000000000000000000000000000000000")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .setFeeTo(treasury)
    .send({
      from: selectedAccount
    })
}

function addLiquidity () {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  let deadline = Math.round(new Date().getTime()/1000) + 1 * ONE_MINUTE
  contract
    .methods
    .addLiquidity(TOKENS.USDC, TOKENS.USDT, "1"+ZEROES, "752786986217280700", "1", "1", selectedAccount, deadline)
    .send({
      from: selectedAccount
    })
}

function removeLiquidity () {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  let deadline = Math.round(new Date().getTime()/1000) + 3 * ONE_MINUTE
  contract
    .methods
    .removeLiquidity(TOKENS.USDT, TOKENS.USDC, "1"+ZEROES, "1", "1", selectedAccount, deadline)
    .send({
      from: selectedAccount
    })
}

function approveToken () {
  let token = prompt("Please enter token", "USDC")
  let tokenAddress = TOKENS[token]
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
    .approve(ADDRESS_ROUTER, amount)
    .send({
      from: selectedAccount
    })
}

function getQuote () {
  let tokenA = $('#tokenA-select').val()
  let tokenAAddress = TOKENS[tokenA]
  let tokenAAmount = BigInt($('#amountTokenA').val() * 10**18)

  let tokenB = $('#tokenB-select').val()
  let tokenBAddress = TOKENS[tokenB]

  let contract = new dweb3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  
  let path = [
    tokenAAddress, tokenBAddress
  ]

  contract
    .methods
    .getAmountsOut(tokenAAmount, path)
    .call()
    .then(function(res) {
      let tokenBAmount = BigInt(res[1]).toString()
      tokenBAmount /= 10**18
      $('#amountTokenB').val(tokenBAmount)
    })
}

function swap () {
  let tokenA = $('#tokenA-select').val()
  let tokenAAddress = TOKENS[tokenA]
  let tokenAAmount = BigInt($('#amountTokenA').val() * 10**18)

  let tokenB = $('#tokenB-select').val()
  let tokenBAddress = TOKENS[tokenB]
  let tokenBAmount = BigInt($('#amountTokenB').val() * 10**18 * (1-SLIPPAGE_TOLERANCE))

  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  
  let path = [
    tokenAAddress, tokenBAddress
  ]
  let deadline = Math.round(new Date().getTime()/1000) + 3 * ONE_MINUTE

  contract
    .methods
    .swapExactTokensForTokens(
      tokenAAmount,
      tokenBAmount,
      path,
      selectedAccount,
      deadline)
    .send({
      from: selectedAccount
    })
    .then(function(res) {
      console.log(res)
    })
}

function getBalance() {
  let token = prompt("Please enter token", "USDC")
  let tokenAddress = TOKENS[token]
  if (!tokenAddress) {
    alert('Wrong token symbol provided')
    return
  }
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ERC20, tokenAddress)
  contract
    .methods
    .balanceOf(selectedAccount)
    .call()
    .then(function(res) {
      console.log(res)
    })
}

window.addEventListener('load', async () => {
  init()
  document.querySelector("#btn-getBalance").addEventListener("click", getBalance)
  document.querySelector("#btn-addLiquidity").addEventListener("click", addLiquidity)
  document.querySelector("#btn-removeLiquidity").addEventListener("click", removeLiquidity)
  document.querySelector("#btn-approveToken").addEventListener("click", approveToken)
  document.querySelector("#btn-getQuote").addEventListener("click", getQuote)
  document.querySelector("#btn-swap").addEventListener("click", swap)
  document.querySelector("#btn-setTreasury").addEventListener("click", setFeeTo)
  document.querySelector("#btn-getFactory").addEventListener("click", getFactoryAddress)
  document.querySelector("#btn-getTreasury").addEventListener("click", getFeeTo)
  document.querySelector("#btn-getKLast").addEventListener("click", getKLast)
  document.querySelector("#btn-getReserves").addEventListener("click", getReserves)
})