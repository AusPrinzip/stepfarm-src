// RandomNumberGenerator deployed to: 0x43C613E407714a61cE35234f09FC8bB7c7027b0E
// PancakeSwapLottery deployed to: 0x82F8Ca6eCBb337bFA3919b6a66BFA9bEE9fE50AF

let _discountDivisor = "2000";
let _priceTicketInCake = BigInt(5 * 10**15)
console.log(_priceTicketInCake)
let _rewardsBreakdown = ["200", "300", "500", "1500", "2500", "5000"];
let _treasuryFee = "2000";
const contractAddress = "0x82F8Ca6eCBb337bFA3919b6a66BFA9bEE9fE50AF"
const statuses = ["Pending", "Open", "Close", "Claimable"]
setTimeout(async () => {
  const lotteryId = await getLotteryId()
  document.getElementById('lottery-id').innerHTML = `#${lotteryId}`
  viewLottery(lotteryId).then(res => {
    // console.log(res)
    document.getElementById("status").innerHTML = statuses[res.status]
    document.getElementById("amountCollectedInCake").innerHTML = res.amountCollectedInCake
    document.getElementById("endTime").innerHTML = new Date(res.endTime * 1000).toISOString()
    document.getElementById("priceTicketInCake").innerHTML = res.priceTicketInCake
    document.getElementById("startTime").innerHTML = new Date(res.startTime * 1000).toISOString()
    document.getElementById("treasuryFee").innerHTML = res.treasuryFee
    document.getElementById("cakePerBracket").innerHTML = res.cakePerBracket
    document.getElementById("discountDivisor").innerHTML = res.discountDivisor
    document.getElementById("finalNumber").innerHTML = res.finalNumber
  })
}, 2000)

function lotteryInit() {
    document.getElementById("lottery-start").onclick = function () {
        startLottery().then(console.log)
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

function getLotteryId () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, contractAddress)
  return contract.methods.viewCurrentLotteryId().call()
}

function drawFinalNumberAndMakeLotteryClaimable() {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, contractAddress)
  return contract.methods.drawFinalNumberAndMakeLotteryClaimable(lotteryId, false).send({
    from: selectedAccount
  })
  .then(console.log)
  .catch(console.error)
}


function viewLottery (lotteryId) {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, contractAddress)
  return contract.methods.viewLottery(lotteryId).call()
}

async function checkAllowance () {
    return getAllowance(TOKENS.GFT, selectedAccount, contractAddress, function(err, res) {
        console.log(err, res)
    })
}

function approve () {
    return approveToken(TOKENS.GFT, contractAddress, function(err, res) {
        console.log(err, res)
    })
}
function closeLottery () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, contractAddress)
  return contract.methods.closeLottery(lotteryId).send({
      from: selectedAccount
    })
    .then(console.log)
    .catch(console.error)
}
async function startLottery() {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, contractAddress)
  const currentBlockNumber = await web3.eth.getBlockNumber();
  const currentBlock = await web3.eth.getBlock(currentBlockNumber);
  const endTime = new Date(currentBlock.timestamp + 6 * 60).getTime()
  console.log(endTime)
  await contract.methods.startLottery(endTime, _priceTicketInCake, _discountDivisor, _rewardsBreakdown, _treasuryFee).send({
    from: selectedAccount
  }).then(console.log)
}

const _ticketsBought = [
    "1234561"
];

function buyTickets () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, contractAddress)
  return contract.methods.buyTickets(lotteryId, _ticketsBought).send({
    from: selectedAccount
  })
}





