

let _discountDivisor = "2000";
let _priceTicketInCake = BigInt(5 * 10**15)
// console.log(_priceTicketInCake)

const statuses = ["Pending", "Open", "Close", "Claimable"];
let status = "Pending";
let lotteryId
let lotteryData
let boughtTickets = [];

function getTimeRemaining(total){
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

async function lotteryRendering () {

  checkAllowance().then(res => {
    if (res == 0) approveGFT()
  })
  try  {
    lotteryId = await getLotteryId();
    console.log(`LotteryId is: ${lotteryId}`)
    document.getElementById('lottery-id').innerHTML = `#${lotteryId}`
    lotteryData = await viewLottery(lotteryId);
    status = statuses[lotteryData.status];
    document.getElementById('lottery-status').innerHTML = `#${status}`
    // calculateBulkPrice(80).then(console.log)
    boughtTickets = await viewUserInfoForLotteryId();
    // console.log(boughtTickets)
    // refreshTicketList();
  } catch(e) {
    return console.error(e)
  }

  console.log(lotteryData);

  let timer = lotteryData.endTime * 1000 - new Date().getTime();

  if (lotteryData.status == 1 && timer > 0) {
    $('.StyledBuyTicketButton').html("Buy Tickets");
    $('.lottery-info').show()
  }

  if (lotteryData.status !== 0) {
    refreshTicketList();
    $('#ticket-list').show();
  }

  setInterval(() => {
    const { days, hours, minutes, seconds } = getTimeRemaining(timer);
    $('#lottery-timer').html(`${days} days, ${hours} hours, ${minutes} min and ${seconds} secs`)
    timer -= 1000;
  }, 1000)

  // document.getElementById("status").innerHTML = statuses[lotteryData.status]
  // document.getElementById("amountCollectedInGFT").innerHTML = Math.round(lotteryData.amountCollectedInGFT / 10**18)
  // document.getElementById("endTime").innerHTML = new Date(lotteryData.endTime * 1000).toISOString()
  // document.getElementById("priceTicketInGFT").innerHTML = Math.round(lotteryData.priceTicketInGFT / 10**18)
  // document.getElementById("startTime").innerHTML = new Date(lotteryData.startTime * 1000).toISOString()
  // document.getElementById("discount").innerHTML = lotteryData.discountDivisor
  // document.getElementById("finalNumber").innerHTML = lotteryData.finalNumber
  // document.getElementById("lottery-buttons").style.display = "block";
}

function lotteryConnectInit() {
  lotteryRendering()
}

function lotteryInit() {
    lotteryRendering()
    document.getElementById("lottery-buy").onclick = function () {
        buyTickets().then((res) => {
          console.log(res)
          refreshTicketList()
        })
    }
}

function refreshTicketList () {
  // console.log(status)
  const numberOfTickets = boughtTickets[0].length;
  console.log(boughtTickets)
  $("#ticket-list ul").empty();
  for (let i = 0; i < numberOfTickets; i++) {
    $("#ticket-list ul").append(`<li style="background-color: orange; font-family: Poppins; color: white; ${boughtTickets[2][i] ? 'text-decoration: line-through;' : ''};" class="list-group-item">lotteryId: ${lotteryId} | maxNumber: ${boughtTickets[0][i]} | numberOfTickets: ${boughtTickets[1][i]} <button ${status == 'Claimable' ? '' : 'disabled'} class="" onclick="claimTickets(${lotteryId}, ${i})">Claim</button></li></br>`);
  }
}

async function claimTickets (lotteryId, purchaseId) {
  console.log(lotteryId, purchaseId);
  let web3 = new Web3(provider);
  const contract = new web3.eth.Contract(ABI_LOTTERY, PancakeSwapLotteryAddress);
  const result = await contract.methods.claimTickets(lotteryId, purchaseId).send({ from: selectedAccount });
  // lotteryRendering()
  // console.log(result)
  const won = result.events.TicketsClaim.returnValues[4];
  if (won) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => { alert("Congratulations! You won the prize! \n Contact administrator") }, 2000)
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





