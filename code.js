const ONE_MINUTE = 60
const ZEROES = '000000000000000000'
const ADDRESS_ROUTER = '0x9a0a6763589c8bd20d8a83262af491e49f4e3efe'
const TOKENS = {
	USDC: '0x64544969ed7ebf5f083679233325356ebe738930',
	USDT: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd'
}
const SLIPPAGE_TOLERANCE = 0.005
let dweb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
dweb3.eth.getChainId().then(r => console.log('chain id: '+r))

let ABI_ROUTER = null
$.getJSON("abi/PancakeRouter.json", function(json) {
	ABI_ROUTER = json.abi
})

let ABI_ERC20 = null
$.getJSON("abi/PancakeERC20.json", function(json) {
	ABI_ERC20 = json.abi
})

function onAddLiquidity () {
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

function onApproveToken () {
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

function onGetQuote () {
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

function onSwap () {
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

window.addEventListener('load', async () => {
  init()
  document.querySelector("#btn-addLiquidity").addEventListener("click", onAddLiquidity)
	document.querySelector("#btn-approveToken").addEventListener("click", onApproveToken)
	document.querySelector("#btn-getQuote").addEventListener("click", onGetQuote)
	document.querySelector("#btn-swap").addEventListener("click", onSwap)
})