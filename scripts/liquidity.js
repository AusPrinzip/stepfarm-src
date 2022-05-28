
function liquidityInit() {
  setInterval(function() {
    if (!selectedAccount) return
    for (let i = 1; i < POOLS.length; i++) {
      let pid = i
      getBalance(POOLS[i].lpToken, function(err, bal) {
        let farm = POOLS[pid]
        if ($('#liq-'+farm.lpToken))
          $('#liq-'+farm.lpToken).remove()

        if (bal == 0) return
        let balance = formatBalance(bal)
        let html = `
          <div id="liq-${farm.lpToken}">
            <h3>${farm.pair[0]}-${farm.pair[1]} LP: ${balance}</h3>
            <button data-bal="${bal}" id="remove-${farm.lpToken}" class="liquidity-remove-btn">- Remove</button>
          </div>
        `
        $('#list-liqs').append(html)

        document.querySelector("#remove-"+farm.lpToken).addEventListener("click", function() {
          let lpBal = $(this).data('bal')
          let amount = prompt("Amount to withdraw?", lpBal)
          let tokenA = TOKENS[farm.pair[0]]
          let tokenB = TOKENS[farm.pair[1]]          
          removeLiquidity(tokenA, tokenB, amount, function(err, res) {
            console.log(err, res)
          })
        })
      })
    }
  }, 3000)
}


