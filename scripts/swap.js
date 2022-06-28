function tokenAChanged() {
  
  $("#approve-swap").show()
  $("#confirm-swap").hide()

  let tokenA = $('#display-token-A').text().trim()
  let tokenAAddress = TOKENS[tokenA]

  $('#token-balance-disp').text(tokenA)
  $('#approve-swap').text('Approve '+tokenA)

  if (!selectedAccount) return
  
  getBalance(tokenAAddress, function(err, bal) {
    $('#token-balance-A').data('data-bal', bal)
    $('#token-balance-A').text(formatBalance(bal, 4, $('#display-token-A').text().trim()))
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
  swapRateInverted = false;
  let tokenA = Object.keys(TOKENS)[0];
  let tokenB = Object.keys(TOKENS)[1];

  $("#swap-card-container-A").html(
   `<button class="btn btn-default dropdown-toggle swap-card-token-btn" type="button" id="token-select-A" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      <div id="display-token-A">
        <img width="20" src="/images/coins/${tokenA.toLowerCase()}.png"></img>${tokenA}<span class="caret"></span>
      </div>
    </button>
    <input id="input-A" value="0" type="number" style="float:right; width: 70%;" class="swap-card-balance"></input>`
  )
  $("#swap-card-container-B").html(
   `<button class="btn btn-default dropdown-toggle swap-card-token-btn" type="button" id="token-select-B" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      <div id="display-token-B">
        <img width="20" src="/images/coins/${tokenB.toLowerCase()}.png"></img>${tokenB}<span class="caret"></span>
      </div>
    </button>
    <input disabled id="input-B" value="0" type="number" style="float:right; width: 70%;" class="swap-card-balance"></input>`
  )

  $('.swap-tokens-btn').hover(function () {
      $(this).find('img').attr('src', function (i, src) {
          return src.replace('images/swap/arrow.svg', 'images/swap/arrows.svg')
      })
  }, function () {
      $(this).find('img').attr('src', function (i, src) {
          return src.replace('images/swap/arrows.svg', 'images/swap/arrow.svg')
      })
  })

  // Switch tokens (instead of selling A for B, you set to sell B for A)
  $('.swap-tokens-btn').click(function() {
    let tokenA = $('#display-token-A').text().trim()
    let tokenB = $('#display-token-B').text().trim()
    $('#display-token-A').html(`<div class="token-select"><img width="20" src="/images/coins/${tokenB.toLowerCase()}.png"></img> ${tokenB}</div><span class="caret"></span>`);
    $('#display-token-B').html(`<div class="token-select"><img width="20" src="/images/coins/${tokenA.toLowerCase()}.png"></img> ${tokenA}</div><span class="caret"></span>`);
    getQuote();
    tokenAChanged();
  })

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

  // speed selectors
  $("#speed-1").click(function () {
    SPEED = 5
    
    $("#speed-1").removeClass("active");
    $("#speed-2").removeClass("active");
    $("#speed-3").removeClass("active");
    if (!CUSTOM_SLIPPAGE) $("#speed-1").addClass("active");
  });

  $("#speed-2").click(function () {
    SPEED = 6
    
    $("#speed-1").removeClass("active");
    $("#speed-2").removeClass("active");
    $("#speed-3").removeClass("active");
    $("#speed-2").addClass("active");
  });

  $("#speed-3").click(function () {
    SPEED = 7
    
    $("#speed-1").removeClass("active");
    $("#speed-2").removeClass("active");
    $("#speed-3").removeClass("active");
    $("#speed-3").addClass("active");
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
    if (event.target == document.getElementById("tokenModal")) {
      document.getElementById("tokenModal").style.display = "none";
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
    let tokenDecimals = TOKENDECIMALS[$('#display-token-A').text().trim()]
    const maxTrade = $("#token-balance-A").data('data-bal') / Math.pow(10,tokenDecimals)
    console.log(`maxtrade = ${maxTrade}`)
    $("#input-A").val(maxTrade)
    getQuote();
  })

  $('#swap-rate-invert').click(function() {
    swapRateInverted = !swapRateInverted
    getQuote();
  })

  tokenAChanged()

  document.querySelector("#approve-swap").addEventListener("click", function() {
    if (!selectedAccount) return onConnect()
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

function setFeeToSetter () {
  let treasury = prompt("Please enter fee setter address", "0x0000000000000000000000000000000000000000")
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .setFeeToSetter(treasury)
    .send({
      from: selectedAccount
    })
}

function addLiquidity (tokenA, tokenB, amountA, amountB, cb) {
  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  let deadline = Math.round(new Date().getTime()/1000) + 1 * ONE_MINUTE
  amountA = BigInt(Math.round(amountA))
  amountB = BigInt(Math.round(amountB))
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
  let tokenADecimals = TOKENDECIMALS[tokenA]
  let tokenAAmount = BigInt($('#input-A').val() * 10**tokenADecimals)

  let tokenBAddress = TOKENS[tokenB]
  let tokenBDecimals = TOKENDECIMALS[tokenB]

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
      tokenBAmount /= 10**tokenBDecimals
      $('#input-B').val(tokenBAmount)
      let html = ''
      if (swapRateInverted) {
        html += Math.round((res[0] / res[1]) * 10**4) / 10**4
        html += ' '+$('#display-token-A').text().trim()
        html += ' per '+$('#display-token-B').text().trim()
      } else {
        html += Math.round((res[1] / res[0]) * 10**4) / 10**4
        html += ' '+$('#display-token-B').text().trim()
        html += ' per '+$('#display-token-A').text().trim()
      }
      $('#swap-rate').html(html)
      $('.swap-exchange').show()
    })
    .catch((e) => console.error(e))
}

function swap () {
  $('#body-overlay').show()
  let tokenA = $('#display-token-A').text().trim()
  let tokenAAddress = TOKENS[tokenA]
  let tokenADecimals = TOKENDECIMALS[tokenA]
  let tokenAAmount = BigInt($('#input-A').val() * 10**tokenADecimals)

  let tokenB = $('#display-token-B').text().trim()
  let tokenBAddress = TOKENS[tokenB]
  let tokenBDecimals = TOKENDECIMALS[tokenB]
  let tokenBAmount = BigInt(Math.floor($('#input-B').val() * 10**tokenBDecimals * (1-SLIPPAGE_TOLERANCE)))

  let web3 = new Web3(provider)
  let contract = new web3.eth.Contract(ABI_ROUTER, ADDRESS_ROUTER)
  
  let path = [
    tokenAAddress, tokenBAddress
  ]

  // let useGftAsMiddleToken = true;

  // // dont use GFT as middle token if GFT is already in the pair
  // if (path[0] == TOKENS["GFT"] || path[1] == TOKENS["GFT"])
  //   useGftAsMiddleToken = false;

  // // dont use GFT as middle token for GMT/GST pair
  // if (path[0] == TOKENS["GMT"] && path[1] == TOKENS["GST"])
  //   useGftAsMiddleToken = false;
  // if (path[0] == TOKENS["GST"] && path[1] == TOKENS["GMT"])
  //   useGftAsMiddleToken = false;
  
  // if (useGftAsMiddleToken) {
  //   path.push(path[1])
  //   path[1] = TOKENS["GFT"]
  // }

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
      tokenAChanged()
      $('#body-overlay').hide()
      console.log(res)
    })
    .catch((e) => {
      $('#body-overlay').show()
      console.error(e)
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