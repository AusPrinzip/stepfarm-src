function tokenAChanged() {
  $("#approve-swap").show()
  $("#confirm-swap").hide()

  let tokenA = $('#display-token-A').text().trim()
  let tokenAAddress = TOKENS[tokenA]

  $('#token-balance-disp').text(tokenA)
  $('#approve-swap').text('Approve '+tokenA)

  if (!selectedAccount) return
  
  getBalance(tokenAAddress, function(err, bal) {
    $('#token-balance-A').attr('data-bal', bal)
    $('#token-balance-A').text(formatBalance(bal))
  })

  getAllowance(tokenAAddress, selectedAccount, ADDRESS_ROUTER, function(err, allow) {
    if (allow > 0) {
      $("#approve-swap").hide()
      $("#confirm-swap").show()
    }
  })
}

function swapConnectInit() {
  tokenAChanged()
}

function swapInit() {
  var changeToken = "A";
  // set default deadline (min) val to 20
  document.getElementById('deadline').value = DEADLINE_MIN;

  // slippage selectors
  $("#slippage-1").click(function () {
    SLIPPAGE_TOLERANCE = 0.1
    
    $("#slippage-1").removeClass("active");
    $("#slippage-2").removeClass("active");
    $("#slippage-3").removeClass("active");
    if (!CUSTOM_SLIPPAGE) $("#slippage-1").addClass("active");
  });

  $("#slippage-2").click(function () {
    SLIPPAGE_TOLERANCE = 0.5
    
    $("#slippage-1").removeClass("active");
    $("#slippage-2").removeClass("active");
    $("#slippage-3").removeClass("active");
    $("#slippage-2").addClass("active");
  });

  $("#slippage-3").click(function () {
    SLIPPAGE_TOLERANCE = 1
    
    $("#slippage-1").removeClass("active");
    $("#slippage-2").removeClass("active");
    $("#slippage-3").removeClass("active");
    $("#slippage-3").addClass("active");
  });


  // Settings Modal

  // When the user clicks on the button, open the modal
  document.getElementById("settingsModalTrigger").onclick = function() {
    document.getElementById("settingsModal").style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  document.getElementById("closeSettingsModal").onclick = function() {
    document.getElementById("settingsModal").style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == document.getElementById("settingsModal")) {
      document.getElementById("settingsModal").style.display = "none";
    }
  }

  // Token select Modal
  document.getElementById("token-select-A").onclick = function() {
    document.getElementById("tokenModal").style.display = "block";
    changeToken = "A";
  }
  document.getElementById("token-select-B").onclick = function() {
    document.getElementById("tokenModal").style.display = "block";
    changeToken = "B";
  }
  $('.token-element').click(function() {
    const token = $(this).attr("value");
    if (changeToken == "A") {
      tokenA = token
      $('#display-token-A').html(`<div class="token-select"><img width="20" src="/images/coins/${token.toLowerCase()}.png"></img> ${token}</div><span class="caret"></span>`);
      tokenAChanged()
    } else {
      tokenB = token
      $('#display-token-B').html(`<div class="token-select"><img width="20" src="/images/coins/${token.toLowerCase()}.png"></img> ${token}</div><span class="caret"></span>`);
    }
    document.getElementById("tokenModal").style.display = "none";
  });
  document.getElementById("closeTokenModal").onclick = function() {
    document.getElementById("tokenModal").style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == document.getElementById("tokenModal")) {
      document.getElementById("tokenModal").style.display = "none";
    }
  }

  // Automatic "get quote" when user changes swap amounts in input fields
  $("#input-A").focus(function() { $(this).select(); } );
  $("#input-A").change(function() {
    getQuote();
  })
  $("#input-A").keyup(function() {
    getQuote();
  })

  // Confirm swap
  $("#confirm-swap").click(function () {
    swap();
  })

  $("#maxTrade").click(function() {
    $("#input-A").val($("#token-balance-A").data('bal') / Math.pow(10,18))
    getQuote();
  })

  tokenAChanged()

  document.querySelector("#btn-getBalance").addEventListener("click", function() {
    let token = prompt("Please enter token", "USDC")
    let tokenAddress = TOKENS[token]
    getBalance(tokenAddress, function(err, res) {
      console.log(err, res)
    })
  })
  document.querySelector("#btn-addLiquidity").addEventListener("click", addLiquidity)
  document.querySelector("#btn-removeLiquidity").addEventListener("click", removeLiquidity)
  document.querySelector("#btn-approveToken").addEventListener("click", function() {
    let token = prompt("Please enter token", "USDC")
    let tokenAddress = TOKENS[token]
    approveToken(tokenAddress, ADDRESS_ROUTER, function(err, res) {
      console.log(err, res)
    })
  })
  document.querySelector("#btn-setTreasury").addEventListener("click", setFeeTo)
  document.querySelector("#btn-getFactory").addEventListener("click", getFactoryAddress)
  document.querySelector("#btn-getTreasury").addEventListener("click", getFeeTo)
  document.querySelector("#btn-getKLast").addEventListener("click", getKLast)
  document.querySelector("#btn-getReserves").addEventListener("click", getReserves)
  document.querySelector("#btn-getPair").addEventListener("click", getPair)  
  document.querySelector("#approve-swap").addEventListener("click", function() {
    let tokenA = $('#display-token-A').text().trim()
    let tokenAddress = TOKENS[tokenA]
    approveToken(tokenAddress, ADDRESS_ROUTER, function(err, res) {
      console.log(err, res)
    })
  })
}

function getReserves(lpAddress, cb) {
  let contract = new dweb3.eth.Contract(ABI_PAIR, lpAddress)
  contract
    .methods
    .getReserves()
    .call()
    .then(function(res) {
      cb(null, res)
    })
}

function getKLast() {
  let lpAddress = prompt("Please enter LP address", "0x")
  let contract = new dweb3.eth.Contract(ABI_PAIR, lpAddress)
  contract
    .methods
    .kLast()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function getFactoryAddress() {
  let contract = new dweb3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  contract
    .methods
    .factory()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function getFeeTo () {
  let contract = new dweb3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .feeTo()
    .call()
    .then(function(res) {
      console.log(res)
    })
}

function setFeeTo () {
  let treasury = prompt("Please enter treasury address", "0x0000000000000000000000000000000000000000")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .setFeeTo(treasury)
    .send({
      from: selectedAccount
    })
}

function addLiquidity (tokenA, tokenB, amountA, amountB, cb) {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  let deadline = Math.round(new Date().getTime()/1000) + 1 * ONE_MINUTE
  amountA = BigInt(amountA)
  amountB = BigInt(amountB)
  contract
    .methods
    .addLiquidity(tokenA, tokenB, amountA.toString(), amountB.toString(), "1", "1", selectedAccount, deadline)
    .send({
      from: selectedAccount
    })
    .then(function(res){
      cb(null, res)
    })
}

function removeLiquidity (tokenA, tokenB, lpAmount, cb) {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  let deadline = Math.round(new Date().getTime()/1000) + 3 * ONE_MINUTE
  contract
    .methods
    .removeLiquidity(tokenA, tokenB, lpAmount, "1", "1", selectedAccount, deadline)
    .send({
      from: selectedAccount
    })
    .then(function(res){
      cb(null, res)
    })
}

function getQuote () {
  let tokenA = $('#display-token-A').text().trim()
  let tokenB = $('#display-token-B').text().trim()
  console.log($('#input-A').val(), tokenA, tokenB)
  let tokenAAddress = TOKENS[tokenA]
  let tokenAAmount = BigInt($('#input-A').val() * 10**18)

  // let tokenB = $('#tokenB-select').val()
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
      console.log(res)
      let tokenBAmount = BigInt(res[1]).toString()
      tokenBAmount /= 10**18
      $('#input-B').val(tokenBAmount)
    })
}

function swap () {
  let tokenA = $('#display-token-A').text().trim()
  let tokenAAddress = TOKENS[tokenA]
  let tokenAAmount = BigInt($('#input-A').val() * 10**18)

  let tokenB = $('#display-token-B').text().trim()
  let tokenBAddress = TOKENS[tokenB]
  let tokenBAmount = BigInt($('#input-B').val() * 10**18 * (1-SLIPPAGE_TOLERANCE))

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

function getPair() {
  let index = prompt("Please enter index", "0")
  let contract = new dweb3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .allPairs(index)
    .call()
    .then(function(res) {
      console.log(res)
    })
}