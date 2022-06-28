function liquidityConnectInit() {
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
          <button id="approve-${farm.lpToken}" class="liquidity-approve-btn">Approve ${farm.pair[0]}-${farm.pair[1]} LP</button>
          <button style="display:none" data-bal="${bal}" id="remove-${farm.lpToken}" class="liquidity-remove-btn">- Remove</button>
        </div>
      `

      getAllowance(farm.lpToken, selectedAccount, ADDRESS_ROUTER, function(err, allow) {
        $('#list-liqs').append(html)

        if (allow > 0) {
          $("#approve-"+farm.lpToken).hide()
          $("#remove-"+farm.lpToken).show()
        }

        document.querySelector("#approve-"+farm.lpToken).addEventListener("click", function() {
          approveToken(farm.lpToken, ADDRESS_ROUTER, function(err, res) {
            console.log(err, res)
            if (!err) {
              $("#approve-"+farm.lpToken).hide()
              $("#remove-"+farm.lpToken).show()
            }
          })
        })

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
    })
  }
}


function liquidityInit() {
  if (selectedAccount) liquidityConnectInit()
  document.querySelector(".farm-liquidity-connect-btn").addEventListener("click", function(e) {
    if (!selectedAccount) return onConnect()
    window.location.href='/#add'
  })
}


