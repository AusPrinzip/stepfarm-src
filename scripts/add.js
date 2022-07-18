
function addInit() {
  reserves = null
  rate = null
  // check pair reserves
  setInterval(function() {
    let tokens = []
    tokens.push(TOKENS[$('#display-token-A').text().trim()])
    tokens.push(TOKENS[$('#display-token-B').text().trim()])
    if (!tokens || tokens.length != 2) return
    if (tokens[0] == null || tokens[1] == null) return
    let sortedTokens = []
    for (let i = 0; i < tokens.length; i++)
      sortedTokens.push(tokens[i])
    sortedTokens = sortedTokens.sort(function(a,b) {
      if (a > b) return 1;
      if (b > a) return -1;
      if (b == a) return 0;
    })
    getPair(tokens, function(err, pair) {
      getReserves(pair, function(err, res) {
        if (sortedTokens[0] != tokens[0]) {
          let tmp = res[0]
          res[0] = res[1]
          res[1] = tmp
        }
        reserves = res
        
        let decimalsA = TOKENDECIMALS[$('#display-token-A').text().trim()]
        let decimalsB = TOKENDECIMALS[$('#display-token-B').text().trim()]
        rate = Math.pow(10, decimalsA) * reserves[1] / (Math.pow(10, decimalsB) * reserves[0])
        $('#rate-amount-B').text(formatNumber(rate))

        if ($('#input-A').val() > 0)
          getMatchingAmount()
      })
    })

    // check allowance
    if (selectedAccount) {
      getAllowance(tokens[0], selectedAccount, ADDRESS_ROUTER, function(err, allow) {
        $('.approveBtn1').attr('data-token', tokens[0])
        if (allow > 0) {
          $('.approveBtn1').hide()
          if ($('.approveBtn2')[0].style.display != 'none')
            $('.add-card-add-btn').show()
        }
      })

      getAllowance(tokens[1], selectedAccount, ADDRESS_ROUTER, function(err, allow) {
        $('.approveBtn2').attr('data-token', tokens[1])
        if (allow > 0) {
          $('.approveBtn2').hide()
          if ($('.approveBtn1')[0].style.display != 'none')
            $('.add-card-add-btn').show()
        }
      })
    }
  }, 3000)

  // check user balances
  setInterval(function() {
    if (!selectedAccount) return
    let token = TOKENS[$('#display-token-A').text().trim()]
    if (!token || token == null) return
    getBalance(token, function(err, bal) {
      $('#balance-token-A').text(formatBalance(bal,4,$('#display-token-A').text().trim()))
      $('#balance-token-A').attr('data-bal', bal)
    })
  }, 3000)
  setInterval(function() {
    if (!selectedAccount) return
    let token = TOKENS[$('#display-token-B').text().trim()]
    if (!token || token == null) return
    getBalance(token, function(err, bal) {
      $('#balance-token-B').text(formatBalance(bal,4,$('#display-token-B').text().trim()))
      $('#balance-token-B').attr('data-bal', bal)
    })
  }, 3000)

  // Automatic "get quote" when user changes swap amounts in input fields
  $("#input-A").focus(function() { $(this).select(); } );
  $("#input-A").change(function() {
    getMatchingAmount();
  })
  $("#input-A").keyup(function() {
    getMatchingAmount();
  })

  // Add liq button
  document.querySelector(".add-card-add-btn").addEventListener("click", function() {
    let tokenA = TOKENS[$('#display-token-A').text().trim()]
    let tokenB = TOKENS[$('#display-token-B').text().trim()]
    let amountA = $('#input-A').val() * Math.pow(10, TOKENDECIMALS[$('#display-token-A').text().trim()])
    let amountB = $('#input-B').val() * Math.pow(10, TOKENDECIMALS[$('#display-token-B').text().trim()])
    addLiquidity(tokenA, tokenB, amountA, amountB, function(err, res) {
      console.log(err, res)
    })
  })

  // Approve buttons
  document.querySelectorAll('.add-card-approve-btn').forEach(item => {
    item.addEventListener('click', function() {
      approveToken($(this).data('token'), ADDRESS_ROUTER, function(err, res) {
        console.log(err, res)
      })
    })
  }) 


  // Token select Modal

  // When the user clicks on the button, open the modal
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
      $('.approveBtn1').text("Approve "+tokenA)
      $('.approveBtn1').show()
      $('#rate-currency-A').text(tokenA)
    } else {
      tokenB = token
      $('#display-token-B').html(`<div class="token-select"><img width="20" src="/images/coins/${token.toLowerCase()}.png"></img> ${token}</div><span class="caret"></span>`);
      $('.approveBtn2').text("Approve "+tokenB)
      $('.approveBtn2').show()
      $('#rate-currency-B').text(tokenB)
    }
    document.getElementById("tokenModal").style.display = "none";
  });

  // When the user clicks on <span> (x), close the modal
  document.getElementById("closeTokenModal").onclick = function() {
    document.getElementById("tokenModal").style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == document.getElementById("tokenModal")) {
      document.getElementById("tokenModal").style.display = "none";
    }
  }
}

function getPair (tokens, cb) {
  let contract = new dweb3.eth.Contract(ABI_FACTORY, ADDRESS_FACTORY)
  contract
    .methods
    .getPair(tokens[0], tokens[1])
    .call()
    .then(function(res) {
      cb(null, res)
    })
}

function getMatchingAmount() {
  if (!reserves) return
  if (!rate) return
  let amountA = Number($('#input-A').val())
  let amountB = amountA * rate
  $('#input-B').val(amountB)
}

