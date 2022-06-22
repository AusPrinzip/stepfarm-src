// design related JS logic

function addEmail() {
  $.post(STEPFARM_API+"/mailing", { email: email.value })
  .done(function( data ) {
    console.log(data)
    alert(data)
  });
}

function numberWithCommas(x) {
    return parseFloat(x).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fadeColor () {
  console.log("highlighting")
  $("#start").toggle( "highlight" );
  $("#start").toggle( "highlight" );
}

async function indexInit() {
  const { gftPrice, holders, marketcap, supply, sumTvl } = await fetch(`https://api.stepfarm.io/stats`).then(res => res.json())
  $('#total-tvl').text(`$${numberWithCommas(sumTvl / 10e18)}`)
  $('#supply').text(numberWithCommas(supply))
  $('#mcap').text(`$${numberWithCommas(marketcap)}`)
  $('#holders').text(holders)

  $(document).ready(function() {
    const el = $('#start')
    el.mouseover(() => {
      $(".start-description").fadeIn("fast")
      el.css("fill","black")
    })
    el.mouseout(() => {
      el.css("fill","#00E8E7")
      $(".start-description").fadeOut("fast")
    })

    const start = document.querySelector(`#start`);
    new Waypoint( {
        element: start,
        handler: function() { 
            fadeColor()
            this.destroy()
        },
        offset: '50%',
    })

  });
  window.addEventListener('resize', function () { // conditional rendering based on viewport width
    if (viewportWidth <= 544) {
      $('.hero').attr("src", "/images/hero-mobile.svg");
      $('.shoe-mobile').show();
      $('.stats-rows').hide()
    } else {
      $('.hero').attr("src", "/images/hero.svg");
      $('.stat').show()
      $('.stats-rows').show()
      $('.shoe-mobile').hide();
    }
  }, false);

  if (viewportWidth <= 544) {
    $('.hero').attr("src", "/images/hero-mobile.svg");
    $('.shoe-mobile').show();
    $('.stats-rows').hide()
  } else {
    $('.hero').attr("src", "/images/hero.svg");
    $('.stat').show()
    $('.stats-rows').show()
    $('.shoe-mobile').hide();
  }

  const counters = 4;
  const firstCounter = document.querySelector('.counter1')
  for (let i = 1; i <= counters; i++) {
    const el = document.querySelector(`.counter${i}`);
    const counterUp = window.counterUp.default;
    new Waypoint( {
        element: firstCounter,
        handler: function() { 
            counterUp(el, { duration: 3000, delay: 16 }) 
            this.destroy()
        },
        offset: '80%',
    })
  }
}