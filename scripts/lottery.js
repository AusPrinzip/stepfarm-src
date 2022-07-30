// RandomNumberGenerator deployed to: 0x11F98F7A636B67fC6f4078aF02536B4E979B1eBE
// STEPNNFT deployed to: 0x39344eF6322290561eDd86033C81f921159FFed3
// PancakeSwapLottery deployed to: 0x1acF805CEa704D2A01864b2ecA5B4302C9F7a95E

let _discountDivisor = "2000";
let _priceTicketInCake = BigInt(5 * 10**15)
// console.log(_priceTicketInCake)

const RandomNumberGeneratorAddress = "0x11F98F7A636B67fC6f4078aF02536B4E979B1eBE";
const STEPNNFTAddress = "0x39344eF6322290561eDd86033C81f921159FFed3";
const PancakeSwapLotteryAddress = "0x1acF805CEa704D2A01864b2ecA5B4302C9F7a95E";

const statuses = ["Pending", "Open", "Close", "Claimable"];
let lotteryId
let lotteryData
let boughtTickets = [];



async function start () {
  checkAllowance().then(res => {
    if (res == 0) approveGFT()
  })
  try  {
    lotteryId = await getLotteryId();
    console.log(`LotteryId is: ${lotteryId}`)
    document.getElementById('lottery-id').innerHTML = `#${lotteryId}`
    lotteryData = await viewLottery(lotteryId);
    // calculateBulkPrice(80).then(console.log)
    boughtTickets = await viewUserInfoForLotteryId();
    // console.log(boughtTickets)
    refreshTicketList();
  } catch(e) {
     return console.error(e)
  }
  // console.log(lotteryData)
  document.getElementById("status").innerHTML = statuses[lotteryData.status]
  document.getElementById("amountCollectedInGFT").innerHTML = Math.round(lotteryData.amountCollectedInGFT / 10**18)
  document.getElementById("endTime").innerHTML = new Date(lotteryData.endTime * 1000).toISOString()
  document.getElementById("priceTicketInGFT").innerHTML = Math.round(lotteryData.priceTicketInGFT / 10**18)
  document.getElementById("startTime").innerHTML = new Date(lotteryData.startTime * 1000).toISOString()
  document.getElementById("discount").innerHTML = lotteryData.discountDivisor
  document.getElementById("finalNumber").innerHTML = lotteryData.finalNumber
  document.getElementById("lottery-buttons").style.display = "block";
}

function lotteryConnectInit() {
  start()
}

function lotteryInit() {
  // setTimeout(async () => { start() }, 2000)
    document.getElementById("lottery-set").onclick = function () {
        setTokenId().then(res => console.log(res))
    }
    document.getElementById("lottery-transfer").onclick = function () {
        transferNFT().then(res => console.log(res))
    }
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
        buyTickets().then((res) => {
          console.log(res)
          refreshTicketList()
        })
    }
    document.getElementById("lottery-stop").onclick = function () {
        closeLottery().then(console.log)
    }
    document.getElementById("lottery-draw").onclick = function () {
        drawFinalNumberAndMakeLotteryClaimable().then(console.log)
    }
}

function refreshTicketList () {
  const numberOfTickets = boughtTickets[0].length;
  $("#ticket-list ul").empty();
  for (let i = 0; i < numberOfTickets; i++) {
    if (!boughtTickets[2][i]) $("#ticket-list ul").append(`<li class="list-group-item">maxNumber: ${boughtTickets[0][i]} | numberOfTickets: ${boughtTickets[1][i]} <button onclick="claimTickets(${lotteryId}, ${i})">Claim</button></li>`);
  }
}

async function claimTickets (lotteryId, purchaseId) {
  console.log(lotteryId, purchaseId);
  let web3 = new Web3(provider);
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress);
  const result = await contract.methods.claimTickets(lotteryId, purchaseId).send({ from: selectedAccount });
  start()
  console.log(result)
  const won = result.events.TicketsClaim.returnValues[4];
  if (won) {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  }
}

function viewUserInfoForLotteryId () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress);
  return contract.methods.viewUserInfoForLotteryId(selectedAccount, lotteryId).call()
}
 

function calculateBulkPrice (numberTickets) {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress);
  return contract.methods.calculateTotalPriceForBulkTickets(_discountDivisor, _priceTicketInCake, numberTickets).call()
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
  return new Promise((resolve, reject) => {
    getAllowance(TOKENS.GFT, selectedAccount, PancakeSwapLotteryAddress, function(err, res) {
        if (err) return reject(err)
        resolve(res)
    })
  })
}

function approveGFT () {
    return approveToken(TOKENS.GFT, PancakeSwapLotteryAddress)
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
  const minutes = prompt("Please select in minutes the duration of the lottery (min 5)")
  const endTime = new Date(currentBlock.timestamp + minutes * 60).getTime()
  const GFTPricePerTicket = prompt("Please input GFT price per ticket")
  const tokenId = prompt("Please input tokenId of prize NFT")
  await contract.methods.startLottery(endTime, BigInt(GFTPricePerTicket*10**18), _discountDivisor, tokenId).send({
    from: selectedAccount
  }).then(console.log)
}

const _ticketsBought = [
    "1234561"
];

function buyTickets () {
  let web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress)
  const amount = prompt("Please input the amount of tickets you want to buy (max 100)")
  return contract.methods.buyTickets(lotteryId, amount).send({
    from: selectedAccount
  })
}





