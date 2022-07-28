// RandomNumberGenerator deployed to: 0x56721f2BAb1DE62545FF8393efAEaA670745CE9D
// STEPNNFT deployed to: 0x0720eAE0bDF8B6B495E84442A32fF5a22134609b
// PancakeSwapLottery deployed to: 0xcDC5fAf71DbC8DDAA001291A67dBCd5895BCB7bE

let _discountDivisor = "2000";
let _priceTicketInCake = BigInt(5 * 10**15)
console.log(_priceTicketInCake)
let _rewardsBreakdown = ["200", "300", "500", "1500", "2500", "5000"];
let _treasuryFee = "2000";
const RandomNumberGeneratorAddress = "0x56721f2BAb1DE62545FF8393efAEaA670745CE9D";
const STEPNNFTAddress = "0x0720eAE0bDF8B6B495E84442A32fF5a22134609b";
const PancakeSwapLotteryAddress = "0xcDC5fAf71DbC8DDAA001291A67dBCd5895BCB7bE";
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
  console.log(lotteryData)
  document.getElementById("status").innerHTML = statuses[lotteryData.status]
  document.getElementById("amountCollectedInCake").innerHTML = lotteryData.amountCollectedInCake
  document.getElementById("endTime").innerHTML = new Date(lotteryData.endTime * 1000).toISOString()
  document.getElementById("priceTicketInCake").innerHTML = lotteryData.priceTicketInCake
  document.getElementById("startTime").innerHTML = new Date(lotteryData.startTime * 1000).toISOString()
  document.getElementById("discount").innerHTML = lotteryData.discountDivisor
  document.getElementById("finalNumber").innerHTML = lotteryData.finalNumber
  document.getElementById("lottery-buttons").style.display = "block";
}, 2000)

function lotteryInit() {
    document.getElementById("lottery-set").onclick = function () {
        setTokenId().then(res => console.log(res))
    },
    document.getElementById("lottery-transfer").onclick = function () {
        transferNFT().then(res => console.log(res))
    },
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

function setTokenId () {
  console.log('setTokenId')
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress);
  const tokenId = prompt("Please input tokenId")
  return contract.methods.setTokenId(tokenId).send({ from: selectedAccount })
}

async function scanEvents () {
  let web3 = new Web3(provider)
  const currentBlockNumber = await web3.eth.getBlockNumber()
  console.log(`Current block #: ${currentBlockNumber}`)
  const myContract = new web3.eth.Contract(ABI_ERC721, STEPNNFTAddress);
  myContract.getPastEvents("allEvents", { fromBlock: currentBlockNumber - 4000, toBlock: 'latest' }).then(res => console.log(res))
}

function getNFTbalance () {
  let web3 = new Web3(provider)
  // Get ERC20 Token contract instance
  let contract = new web3.eth.Contract(ABI_STEPNNFT, STEPNNFTAddress);
  // call transfer function
  return contract.methods.balanceOf(selectedAccount).call()
}

function transferNFT () {
  let web3 = new Web3(provider)
  // Get ERC20 Token contract instance
  let contract = new web3.eth.Contract(ABI_ERC721, STEPNNFTAddress);
  // call transfer function
  const tokenId = prompt("please enter tokenId")
  return contract.methods.transferFrom(selectedAccount, PancakeSwapLotteryAddress, tokenId).send({ from: selectedAccount})
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
  return contract.methods.drawFinalNumberAndMakeLotteryClaimable(lotteryId).send({
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
  return contract.methods.buyTickets(lotteryId, 80).send({
    from: selectedAccount
  })
}





