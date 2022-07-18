
let farmMaxAmount = null;

function renderFarmStats () {
  for (let i = 0; i < POOLS.length; i++) {
    const _tvl = tvl[i]
    let pid = i
    $('#farm'+pid+'-tvl').text('$'+ formatBalance(_tvl, 0))
    let rewardYear = POOLS[pid].gftPerBlock * BLOCK_PER_DAY * 365 * gftPrice
    let apr = rewardYear / _tvl
    apr = Math.round(1000*apr)/100
    $('#farm'+pid+'-apr').text(apr+'%')
    $(`.farm-card-stats-${pid}`).show()
    $(`.spinner-${pid}`).hide()
  }
}

function checkCardsApproval () {
  if (selectedAccount)
    for (let i = 0; i < POOLS.length; i++) {
      let pid = i
      getAllowance(POOLS[pid].lpToken, selectedAccount, ADDRESS_MASTERCHEF, function(err, allowance) {
        if (allowance > 0) {
          $("#farm"+pid+"-approve").hide()
          $(`#farm${pid}-deposit`).show()
          $(`#farm${pid}-withdraw`).show()
        } else {
          $(`#farm${pid}-deposit`).hide()
          $(`#farm${pid}-withdraw`).hide()
          $("#farm"+pid+"-approve").show()
        }
      })
    }
}

function farmConnectInit () {
  checkCardsApproval()
}

async function farmInit() {
  for (let i = 0; i < POOLS.length; i++) {
    const _tvl = tvl[i]
    let farm = POOLS[i]
    let pid = i
    let depositAsset = farm.pair[0]+'-'+farm.pair[1]+' LP'
    let name = farm.pair[0]+'-'+farm.pair[1]
    let coinAstyle = ''
    if (farm.pair[0] === farm.pair[1]) {
      // GFT staking pool
      name = farm.pair[0]+' Staking'
      depositAsset = farm.pair[0]
      coinAstyle = 'display:none'
    }
    $("#farm-cards").append(`
      <div class="farm-card col-md-3" data-pid="${pid}" data-address="${farm.lpToken}">
        <div class="farm-card-header">
          <div id="farm-card-symbol">
            <img id="farm-coin-A" src="/images/coins/${farm.pair[0].toLowerCase()}.png" style="${coinAstyle}"></img>
            <img id="farm-coin-B" src="/images/coins/${farm.pair[1].toLowerCase()}.png"></img>
          </div>
          <div class="farm-card-block">
            <span id="farm-card-display">${name}</span>
            <div class="farm-card-title">
              <img src="/images/icons/core.svg"></img>
              <div class="multiplier">${farm.multiplier}</div>
            </div>
          </div>
        </div>

        <!-- <center><div class="sk-chase spinner-${pid}">
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
        </div></center> -->

        <div class="farm-card-stats farm-card-stats-${pid}" style="display: block;">
          <p>Earn<span style="float: right;">GFT</span></p>
          <p>APR<span style="float: right;" id="farm${pid}-apr">%</span></p>
          <p>TVL<span style="float: right;" id="farm${pid}-tvl">$0.00</span></p>
        </div>

        <div class="farm-card-earned">
          <div class="farm-card-earned-display"><span style="color: #00E8E7;">GFT</span> EARNED</div>
          <div class="farm-card-earned-amount">
            <h3 id="farm${pid}-earned">0</h3>
            <button class="farm-card-harvest-btn" id="farm${pid}-harvest">Harvest</button>
          </div>
          <div class="farm-card-staked">
            <span style="color: #00E8E7;">${depositAsset}</span> STAKED
            <h3 id="farm${pid}-staked">0</h3>
            <div class="farm-card-actions">
              <button class="farm-card-approve-btn" id="farm${pid}-approve">Approve ${depositAsset}</button>
              <button class="farm-card-deposit-btn" style="display: none" id="farm${pid}-deposit">Deposit</button>
              <button class="farm-card-withdraw-btn" style="display: none" id="farm${pid}-withdraw">Withdraw</button>
            </div>
          </div>
        </div>
        
        <div class="farm-card-connect">
          <button class="farm-card-connect-btn" style="display: none">Connect Wallet</button>
        </div>
      </div>`
    );

    setTimeout(function() {
      renderFarmStats()
    }, 100 + i * 300)
    

    setInterval(function() {
      if (!selectedAccount) return
      userInfo(pid, function(err, userInfo) {
        let amount = formatBalance(userInfo.amount, 18).toFixed(18)
        $('#farm'+pid+'-staked').text(amount)
      })
      pendingGft(pid, function(err, pending) {
        $('#farm'+pid+'-earned').text(formatBalance(pending, 3))
      })
    }, 3000 + i * 300)

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == document.getElementById("withdrawModal")) {
        document.getElementById("withdrawModal").style.display = "none";
      }
      if (event.target == document.getElementById("withdrawModal")) {
        document.getElementById("withdrawModal").style.display = "none";
      }
    }

    document.getElementById("maxTrade").onclick = function () {
      $("#input-A").val(farmMaxAmount)
    }

    document.getElementById("closeWithdrawModal").onclick = function() {
      document.getElementById("withdrawModal").style.display = "none";
    }

    document.querySelector("#farm"+pid+"-harvest").addEventListener("click", function(e) {
      let pid = $(this).parent().parent().parent().data('pid')
      if (pid == 0) {
        harvestStaking()
      } else {
        harvestFarm(pid)
      }
    })

    document.querySelector("#farm"+pid+"-deposit").addEventListener("click", function(e) {
      let pid = $(this).parent().parent().parent().parent().data('pid');
      document.getElementById("withdrawModal").style.display = "block";
      $('.farm-modal-title').text(`DEPOSIT ${POOLS[pid].name}`)
      $('#token-balance-disp').text(POOLS[pid].name)
      let lpAddress = $(this).parent().parent().parent().parent().data('address')
      $('#farm-modal-action').text("DEPOSIT")
      if (pid == 0) {
        getBalance(TOKENS['GFT'], function(err, balance) {
          let stringBalance = balance.toString()
          farmMaxAmount = formatBalance(balance, 18).toFixed(18)
          $('#token-balance-A').text(farmMaxAmount)
          document.getElementById("farm-modal-action").onclick = function () {
            document.getElementById("withdrawModal").style.display = "none";
            enterStaking()
          }
        })
      } else {
        getBalance(lpAddress, function(err, balance) {
          farmMaxAmount = formatBalance(balance, 18).toFixed(18)
          $('#token-balance-A').text(farmMaxAmount)
          document.getElementById("farm-modal-action").onclick = function () {
            document.getElementById("withdrawModal").style.display = "none";
            deposit(lpAddress, pid)
          }
        })
      }
    })
  
    document.querySelector("#farm"+pid+"-withdraw").addEventListener("click", function(e) {
      let pid = $(this).parent().parent().parent().parent().data('pid');
      document.getElementById("withdrawModal").style.display = "block";
      $('.farm-modal-title').text(`WITHDRAW ${POOLS[pid].name}`);
      $('#token-balance-disp').text(POOLS[pid].name)
      let lpAddress = $(this).parent().parent().parent().parent().data('address')
      $('#farm-modal-action').text("WITHDRAW")
      if (pid == 0) {
        userInfo(pid, function(err, userInfo) {
         let stringBalance = userInfo.amount.toString()
          farmMaxAmount = formatBalance(balance, 18).toFixed(18)
          $('#token-balance-A').text(farmMaxAmount)
          document.getElementById("farm-modal-action").onclick = function () {
            document.getElementById("withdrawModal").style.display = "none";
            leaveStaking()
          }
        })
      } else {
        userInfo(pid, function(err, userInfo) {
          let stringBalance = userInfo.amount.toString()
          farmMaxAmount = formatBalance(balance, 18).toFixed(18)
          $('#token-balance-A').text(farmMaxAmount)
          document.getElementById("farm-modal-action").onclick = function () {
            document.getElementById("withdrawModal").style.display = "none";
            withdraw(pid)
          }
        })
      }
    })
  
    document.querySelector("#farm"+pid+"-approve").addEventListener("click", function(e) {
      if (!selectedAccount) return onConnect()
      let pid = $(this).parent().parent().parent().parent().data('pid')
      approveToken(POOLS[pid].lpToken, ADDRESS_MASTERCHEF, function(err, res) {
        console.log(err, res)
        checkCardsApproval()
      })
    })
  }
  checkCardsApproval()
}

function getMultiplier() {
  let from = prompt("Enter _from number", "0")
  let to = prompt("Enter _to number", "0")
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .getMultiplier(from, to)
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function setMultiplier() {
  let mult = prompt("Please enter new multiplier", "1")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .updateMultiplier(mult)
    .send({
      from: selectedAccount
    })
}

function poolLength() {
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .poolLength()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function addPair() {
  let alloc = prompt("New pair allocation points", "1")
  let lpAddress = prompt("New LP address", "0x")
  let withUpdate = prompt("With or without mass update?", "0")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .add(alloc, lpAddress, withUpdate)
    .send({
      from: selectedAccount
    })
}

function setPair() {
  let pid = prompt("Pair to update PID?", "0")
  let alloc = prompt("New pair allocation points", "1")
  let withUpdate = prompt("With or without mass update?", "0")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .set(pid, alloc, withUpdate)
    .send({
      from: selectedAccount
    })
}

function deposit(tokenAddress, pid) {
  $('#body-overlay').show()
  let amount = BigIntConstructor($("#input-A").val())
  console.log($("#input-A").val())
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .deposit(pid, amount)
    .send({
      from: selectedAccount
    })
    .then(() => $('#body-overlay').hide())
    .catch((e) => {
      console.error(e)
      $('#body-overlay').hide()
    })
}

function withdraw(pid) {
  $('#body-overlay').show()
  let amount = BigIntConstructor($("#input-A").val())
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .withdraw(pid, amount)
    .send({
      from: selectedAccount
    })
    .then(() => $('#body-overlay').hide())
    .catch((e) => {
      console.error(e)
      $('#body-overlay').hide()
    })
}

function harvestFarm(pid) {
  $('#body-overlay').show()
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .deposit(pid, 0)
    .send({
      from: selectedAccount
    })
    .then(() => $('#body-overlay').hide())
    .catch((e) => {
      console.error(e)
      $('#body-overlay').hide()
    })
}

function enterStaking() {
  $('#body-overlay').show()
  let amount = BigIntConstructor($("#input-A").val())
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .enterStaking(amount)
    .send({
      from: selectedAccount
    })
    .then(() => $('#body-overlay').hide())
    .catch((e) => {
      console.error(e)
      $('#body-overlay').hide()
    })
}

function leaveStaking() {
  $('#body-overlay').show()
  let amount = BigIntConstructor($("#input-A").val())
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .leaveStaking(amount)
    .send({
      from: selectedAccount
    })
    .then(() => $('#body-overlay').hide())
    .catch((e) => {
      console.error(e)
      $('#body-overlay').hide()
    })
}

function harvestStaking() {
  $('#body-overlay').show()
  if (!selectedAccount) return onConnect()
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .enterStaking(0)
    .send({
      from: selectedAccount
    })
    .then(() => $('#body-overlay').hide())
    .catch((e) => {
      console.error(e)
      $('#body-overlay').hide()
    })
}

function poolInfo(pid, cb) {
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .poolInfo(pid)
    .call()
    .then(function(res) {
      cb(null, res)
    })
}

function userInfo(pid, cb) {
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .userInfo(pid, selectedAccount)
    .call()
    .then(function(res) {
      cb(null, res)
    })
}

function pendingGft(pid, cb) {
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .pendingCake(pid, selectedAccount)
    .call()
    .then(function(res) {
      cb(null, res)
    })
}

function getStartBlock() {
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .startBlock()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function setDevAddress() {
  let devAddress = prompt("New dev address", "0x")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .dev(devAddress)
    .send({
      from: selectedAccount
    })
}

function BigIntConstructor(stringAmount) {
  let amount = BigInt(0)
  let foundDot = false
  let decimals = 0
  for (let i = 0; i < stringAmount.length; i++) {
    if (stringAmount[i] == '.') {
      foundDot = true
      continue;
    }
    if (foundDot)
      decimals++
    amount *= BigInt(10);
    amount += BigInt(stringAmount[i])
  }
  if (!foundDot)
    amount *= BigInt(Math.pow(10,18))
  else if (decimals < 18)
    amount *= BigInt(Math.pow(10,18-decimals))

  console.log(amount)
  return amount
}