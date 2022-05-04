const ONE_MINUTE = 60
const ZEROES = '000000000000000000'
const ADDRESS_FACTORY = '0xF8E15161e9e6d59702B3fD9122516a8CB838b96F'
const ADDRESS_ROUTER = '0xEF1B08D473913829a0a6ed32B4c37724bC31f096'
const TOKENS = {
	USDC: '0x64544969ed7ebf5f083679233325356ebe738930',
	USDT: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
	// TEST: '0x84c6becf034ca616bef95e669fc65aa6dc3b1e53'
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
	let deadline = Math.round(new Date().getTime()/1000) + 3 * ONE_MINUTE
	contract
		.methods
		.addLiquidity(TOKENS.USDC, TOKENS.USDT, "5"+ZEROES, "5"+ZEROES, "5"+ZEROES, "5"+ZEROES, selectedAccount, deadline)
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
		.removeLiquidity(TOKENS.USDT, TOKENS.USDC, "3998999999999998000", "1", "1", selectedAccount, deadline)
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
})