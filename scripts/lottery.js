// RandomNumberGenerator deployed to: 0xa71d9d5cE2a45C8c889CB3F514A2E2b3cabB0850
// STEPNNFT deployed to: 0xe2d631696C62A43008D189fFCBFd4f1800669eB0
// PancakeSwapLottery deployed to: 0x783921B2Bf78628E68d8A7463e150cA262C347E1

let _discountDivisor = "2000";
let _priceTicketInCake = BigInt(5 * 10**15)
console.log(_priceTicketInCake)
let _rewardsBreakdown = ["200", "300", "500", "1500", "2500", "5000"];
let _treasuryFee = "2000";
const RandomNumberGeneratorAddress = "0xa71d9d5cE2a45C8c889CB3F514A2E2b3cabB0850";
const STEPNNFTAddress = "0xe2d631696C62A43008D189fFCBFd4f1800669eB0";
const PancakeSwapLotteryAddress = "0x783921B2Bf78628E68d8A7463e150cA262C347E1";
const statuses = ["Pending", "Open", "Close", "Claimable"];
let lotteryId
let lotteryData

setTimeout(async () => {
  try  {
    lotteryId = await getLotteryId();
    document.getElementById('lottery-id').innerHTML = `#${lotteryId}`
    lotteryData = await viewLottery(lotteryId);

  } catch(e) {
     return console.error(e)
  }
  document.getElementById("status").innerHTML = statuses[res.status]
  document.getElementById("amountCollectedInCake").innerHTML = res.amountCollectedInCake
  document.getElementById("endTime").innerHTML = new Date(res.endTime * 1000).toISOString()
  document.getElementById("priceTicketInCake").innerHTML = res.priceTicketInCake
  document.getElementById("startTime").innerHTML = new Date(res.startTime * 1000).toISOString()
  document.getElementById("treasuryFee").innerHTML = res.treasuryFee
  document.getElementById("cakePerBracket").innerHTML = res.cakePerBracket
  document.getElementById("discountDivisor").innerHTML = res.discountDivisor
  document.getElementById("finalNumber").innerHTML = res.finalNumber
}, 2000)

function lotteryInit() {
    document.getElementById("lottery-link").onclick = function () {
        transferLINK().then(res => console.log(res))
    }
    document.getElementById("lottery-mint").onclick = function () {
        mintNFT(selectedAccount, Math.round(Math.random() * 1000)).then(console.log)
    }
    document.getElementById("lottery-start").onclick = function () {
        startLottery().then(console.log)
        .catch(e => console.error(e))
    }
    document.getElementById("lottery-buy").onclick = function () {
        buyTickets().then(console.log)
    }
    document.getElementById("lottery-stop").onclick = function () {
        closeLottery().then(console.log)
    }
    document.getElementById("lottery-draw").onclick = function () {
        drawFinalNumberAndMakeLotteryClaimable().then(console.log)
    }
}

function transferLINK () {
  let web3 = new Web3(provider)
  // Get ERC20 Token contract instance
  let contract = new web3.eth.Contract(ABI_ERC20, LINK_ADDRESS);
  // call transfer function
  return contract.methods.transfer(RandomNumberGeneratorAddress, BigInt(10**18)).send({ from: selectedAccount})
}

function mintNFT (to, tokenId) {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_STEPNNFT, STEPNNFTAddress)
  return contract.methods.mint(to, tokenId).send({ from: selectedAccount })
}

function getLotteryId () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  return contract.methods.viewCurrentLotteryId().call()
}

function drawFinalNumberAndMakeLotteryClaimable() {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  return contract.methods.drawFinalNumberAndMakeLotteryClaimable(lotteryId, false).send({
    from: selectedAccount
  })
  .then(console.log)
  .catch(console.error)
}

function viewLottery (lotteryId) {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  return contract.methods.viewLottery(lotteryId).call()
}

async function checkAllowance () {
    return getAllowance(TOKENS.GFT, selectedAccount, PancakeSwapLotteryAddress, function(err, res) {
        console.log(err, res)
    })
}

function approve () {
    return approveToken(TOKENS.GFT, PancakeSwapLotteryAddress, function(err, res) {
        console.log(err, res)
    })
}

function closeLottery () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  return contract.methods.closeLottery(lotteryId).send({
      from: selectedAccount
    })
    .then(console.log)
    .catch(console.error)
}

async function startLottery() {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  const currentBlockNumber = await web3.eth.getBlockNumber();
  const currentBlock = await web3.eth.getBlock(currentBlockNumber);
  const endTime = new Date(currentBlock.timestamp + 6 * 60).getTime()
  console.log(endTime)
  await contract.methods.startLottery(endTime, _priceTicketInCake, _discountDivisor).send({
    from: selectedAccount
  }).then(console.log)
}

const _ticketsBought = [
    "1234561"
];

function buyTickets () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  return contract.methods.buyTickets(lotteryId, _ticketsBought).send({
    from: selectedAccount
  })
}





