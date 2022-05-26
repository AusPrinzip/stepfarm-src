
function farmInit() {

  for (let i = 0; i < FARMING_OPTIONS.length; i++) {
    const farm = FARMING_OPTIONS[i];
    console.log(farm);
    $("#farm-cards").append(`    
      <div class="farm-card">
        <div class="farm-card-header">
          <div id="farm-card-symbol">
            <img id="farm-coin-A" src="/images/coins/${farm[0].toLowerCase()}.png"></img>
            <img id="farm-coin-B" src="/images/coins/${farm[1].toLowerCase()}.png"></img>
          </div>
          <div class="farm-card-block">
            <span id="farm-card-display">${farm[0]}-${farm[1]}</span>
            <div class="farm-card-title">
              <img src="/images/icons/core.svg"></img>
              <div class="multiplier">40x</div>
            </div>
          </div
        </div>
      </div>`
    );
  }

  document.querySelector("#farm-getMultiplier").addEventListener("click", getMultiplier)
  document.querySelector("#farm-setMultiplier").addEventListener("click", setMultiplier)
  document.querySelector("#farm-poolLength").addEventListener("click", poolLength)
  document.querySelector("#farm-poolInfo").addEventListener("click", poolInfo)
  document.querySelector("#farm-addPair").addEventListener("click", addPair)
  document.querySelector("#farm-setPair").addEventListener("click", setPair)
  
  for (let i = 0; i < POOLS.length; i++) {
    let pid = i
    let name = POOLS[pid].name
    let lpToken = POOLS[pid].lpToken
    setInterval(function() {
      if (!selectedAccount) return
      userInfo(pid, function(err, userInfo) {
        let amount = formatBalance(userInfo.amount)
        $('#farm'+pid+'-staked').text(amount)
      })
    }, 3000)
  
    let html = ''
    $('#farmsrow')[0].innerHTML += `
    <div class="col-md-4">
      <div data-pid="${pid}" data-address="${lpToken}">
        <h2>Stake: <span id="farm${pid}-title">${name}</span></h2>
        <h3>x<span id="farm${pid}-multiplier">1</span></h3>
        <h3>APR: <span id="farm${pid}-apr"></span>%</h3>
        <h3>Earn: GFT</h3>
        <h3>Earned: <span id="farm${pid}-earned">0.000</span></h3>
        <button class="btn btn-primary" id="farm${pid}-harvest">
          Harvest
        </button>
        <button class="btn btn-primary" id="farm${pid}-approve">
          Approve ${name}
        </button>
        <button class="btn btn-primary" id="farm${pid}-deposit">
          Deposit
        </button>
        <button class="btn btn-primary" id="farm${pid}-withdraw">
          Withdraw
        </button>
        <h3>${name} staked: <span id="farm${pid}-staked">0.000</span></h3>
        <h3>Total liquidity: <span id="farm${pid}-liquidity">0.000</span></h3>
      </div>
    </div>
    `
  
    setTimeout(function() {
      document.querySelector("#farm"+pid+"-harvest").addEventListener("click", function(e) {
        let pid = $(this).parent().data('pid')
        if (pid == 0) {
          harvestStaking()
        } else {
          let lpAddress = $(this).parent().data('address')
          harvestFarm(pid)
        }
      })
  
      document.querySelector("#farm"+pid+"-deposit").addEventListener("click", function(e) {
        let pid = $(this).parent().data('pid')
        if (pid == 0) {
          enterStaking()
        } else {
          let lpAddress = $(this).parent().data('address')
          deposit(lpAddress, pid)
        }
      })
    
      document.querySelector("#farm"+pid+"-withdraw").addEventListener("click", function(e) {
        let pid = $(this).parent().data('pid')
        if (pid == 0) {
          leaveStaking()
        } else {
          let lpAddress = $(this).parent().data('address')
          withdraw(pid)
        }
      })
    
      document.querySelector("#farm"+pid+"-approve").addEventListener("click", function(e) {
        let pid = $(this).parent().data('pid')
        approveToken(POOLS[pid].lpToken, ADDRESS_MASTERCHEF, function(err, res) {
          console.log(err, res)
        })
      })
    
      if (selectedAccount)
        getAllowance(POOLS[pid].lpToken, selectedAccount, ADDRESS_MASTERCHEF, function(err, allowance) {
          // TODO
          console.log(allowance)
        })
    }, 1000)
    
  }
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
  getBalance(tokenAddress, function(err, balance) {
    let amount = prompt("Amount to deposit", balance)
    let web3 = new Web3(provider)
    let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
    contract
      .methods
      .deposit(pid, amount)
      .send({
        from: selectedAccount
      })
  })
}

function withdraw(pid) {
  userInfo(pid, function(err, userInfo) {
    let amount = prompt("Amount to withdraw", userInfo.amount)
    let web3 = new Web3(provider)
    let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
    contract
      .methods
      .withdraw(pid, amount)
      .send({
        from: selectedAccount
      })
  })
}

function harvestFarm(pid) {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .deposit(pid, 0)
    .send({
      from: selectedAccount
    })
}

function enterStaking() {
  getBalance(TOKENS['GFT'], function(err, balance) {
    let amount = prompt("Amount to deposit", balance)
    let web3 = new Web3(provider)
    let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
    contract
      .methods
      .enterStaking(amount)
      .send({
        from: selectedAccount
      })
  })
}

function leaveStaking() {
  userInfo(0, function(err, userInfo) {
    let amount = prompt("Amount to deposit", userInfo.amount)
    let web3 = new Web3(provider)
    let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
    contract
      .methods
      .leaveStaking(amount)
      .send({
        from: selectedAccount
      })
  })
}

function harvestStaking() {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .enterStaking(0)
    .send({
      from: selectedAccount
    })
}

function poolInfo() {
  let pid = prompt("PID?", "0")
  let contract = new dweb3.eth.Contract(ABI_MASTERCHEF, ADDRESS_MASTERCHEF)
  contract
    .methods
    .poolInfo(pid)
    .call()
    .then(function(res) {
      console.log(res)
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

