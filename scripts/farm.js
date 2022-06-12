
function farmInit() {
  for (let i = 0; i < POOLS.length; i++) {
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
      <div class="farm-card col-sm-3" data-pid="${pid}" data-address="${farm.lpToken}">
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

        <div class="farm-card-stats">
          <p>Earn<span style="float: right;">GFT</span></p>
        </div>

        <div class="farm-card-stats">
          <p>APR<span style="float: right;" id="farm${pid}-apr">29.5%</span></p>
        </div>

        <div class="farm-card-stats">
          <p>TVL<span style="float: right;" id="farm${pid}-tvl">$0.00</span></p>
        </div>

        <div class="farm-card-earned">
          <div class="farm-card-earned-display"><span style="color: #00E8E7;">GFT</span> EARNED</div>
          <div class="farm-card-earned-amount">
            <h3 id="farm${pid}-earned">0.000</h3>
            <button class="farm-card-harvest-btn" id="farm${pid}-harvest">Harvest</button>
          </div>
          <div class="farm-card-staked">
            <span style="color: #00E8E7;">${depositAsset}</span> STAKED
            <h3 id="farm${pid}-staked">0.000</h3>
            <div class="farm-card-actions">
              <button class="farm-card-approve-btn" id="farm${pid}-approve">Approve ${depositAsset}</button>
              <button class="farm-card-deposit-btn" id="farm${pid}-deposit">Deposit</button>
              <button class="farm-card-withdraw-btn" id="farm${pid}-withdraw">Withdraw</button>
            </div>
          </div>
        </div>
        
        <div class="farm-card-connect">
          <button class="farm-card-connect-btn" style="display: none">Connect Wallet</button>
        </div>
      </div>`
    );

    setTimeout(function() {
      getTvl(pid, function(err, tvl) {
        $('#farm'+pid+'-tvl').text('$'+formatBalance(tvl, 0))
        let rewardYear = POOLS[pid].gftPerBlock * BLOCK_PER_DAY * 365 * gftPrice
        let apr = rewardYear / tvl
        apr = Math.round(1000*apr)/100
        $('#farm'+pid+'-apr').text(apr+'%')
      })
    }, 100)
    

    setInterval(function() {
      if (!selectedAccount) return
      userInfo(pid, function(err, userInfo) {
        let amount = formatBalance(userInfo.amount)
        $('#farm'+pid+'-staked').text(amount)
      })
      pendingGft(pid, function(err, pending) {
        $('#farm'+pid+'-earned').text(formatBalance(pending))
      })
    }, 3000)

    setTimeout(function() {
      document.querySelector("#farm"+pid+"-harvest").addEventListener("click", function(e) {
        let pid = $(this).parent().parent().parent().data('pid')
        if (pid == 0) {
          harvestStaking()
        } else {
          harvestFarm(pid)
        }
      })
  
      document.querySelector("#farm"+pid+"-deposit").addEventListener("click", function(e) {
        let pid = $(this).parent().parent().parent().parent().data('pid')
        if (pid == 0) {
          enterStaking()
        } else {
          let lpAddress = $(this).parent().parent().parent().parent().data('address')
          deposit(lpAddress, pid)
        }
      })
    
      document.querySelector("#farm"+pid+"-withdraw").addEventListener("click", function(e) {
        let pid = $(this).parent().parent().parent().parent().data('pid')
        if (pid == 0) {
          leaveStaking()
        } else {
          withdraw(pid)
        }
      })
    
      document.querySelector("#farm"+pid+"-approve").addEventListener("click", function(e) {
        let pid = $(this).parent().parent().parent().parent().data('pid')
        approveToken(POOLS[pid].lpToken, ADDRESS_MASTERCHEF, function(err, res) {
          console.log(err, res)
        })
      })
    
      if (selectedAccount)
        getAllowance(POOLS[pid].lpToken, selectedAccount, ADDRESS_MASTERCHEF, function(err, allowance) {
          // TODO
          // console.log(allowance)
        })
    }, 1000)
  }
  
  for (let i = 0; i < POOLS.length; i++) {
    let pid = i
    let name = POOLS[pid].name
    let lpToken = POOLS[pid].lpToken

  
    let html = `
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
    let amount = prompt("Amount to withdraw", userInfo.amount)
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

function getTvl(pid, cb) {
  let lpToken = POOLS[pid].lpToken
  getBalanceOf(lpToken, ADDRESS_MASTERCHEF, function(err, bal) {
    if (pid == 0) {
      cb(null, gftPrice*bal)
      return
    }
    getSupply(lpToken, function(err, supply) {
      let percentage = bal / supply
      if (POOLS[pid].pair[0] === 'USDC') {
        getBalanceOf(TOKENS["USDC"], lpToken, function(err, half) {
          cb(null, half*2*percentage)
        })
        return
      }
      if (POOLS[pid].pair[1] === 'USDC') {
        getBalanceOf(TOKENS["USDC"], lpToken, function(err, half) {
          cb(null, half*2*percentage)
        })
        return
      }
      if (POOLS[pid].pair[0] === 'GFT') {
        getBalanceOf(TOKENS["GFT"], lpToken, function(err, half) {
          cb(null, gftPrice*half*2*percentage)
        })
        return
      }
      if (POOLS[pid].pair[1] === 'GFT') {
        getBalanceOf(TOKENS["GFT"], lpToken, function(err, half) {
          cb(null, gftPrice*half*2*percentage)
        })
        return
      }
    })
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