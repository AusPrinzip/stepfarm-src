let ABI_MASTERCHEF = null
$.getJSON("abi/MasterChef.json", function(json) {
  ABI_MASTERCHEF = json.abi
})

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
    console.log(pid, amount)
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

document.querySelector("#farm-getMultiplier").addEventListener("click", getMultiplier)
document.querySelector("#farm-setMultiplier").addEventListener("click", setMultiplier)
document.querySelector("#farm-poolLength").addEventListener("click", poolLength)
document.querySelector("#farm-poolInfo").addEventListener("click", poolInfo)
document.querySelector("#farm-addPair").addEventListener("click", addPair)
document.querySelector("#farm-setPair").addEventListener("click", setPair)
for (let i = 0; i < POOLS.length; i++) {
  let pid = i
  setInterval(function() {
    userInfo(pid, function(err, userInfo) {
      let amount = formatBalance(userInfo.amount)
      $('#farm'+pid+'-staked').text(amount)
    })
  }, 3000)

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

  getAllowance(POOLS[pid].lpToken, selectedAccount, ADDRESS_MASTERCHEF, function(err, allowance) {
    // TODO
    console.log(allowance)
  })
}