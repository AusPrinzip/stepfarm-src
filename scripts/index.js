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

function indexInit() {
  fetch(`https://api.stepfarm.io/stats`).then(res => res.json())
  .then(result => {

    $('#total-tvl').text(`$${numberWithCommas(result.sumTvl / 10e18)}`)
    $('#supply').text(numberWithCommas(result.supply))
    $('#mcap').text(`$${numberWithCommas(result.marketcap)}`)
    $('#holders').text(result.holders)

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

  })
  .catch(e => console.log("API error, contact devs"))
  $(document).ready(function() {
    const ROADMAP_ELEMENTS = ["start", "1"]
    const ROADMAP_DESCRIPTIONS = [
       "<p>We have many features to discover, but everything is secret until the right time! Follow the path and find out regularly what will be the next feature on our roadmap. StepFarm gives wings to your yield!</p>",
       "<p>STAKING & <br> FARMING</p>"
    ]
    for (let i = 0; i < ROADMAP_ELEMENTS.length; i++) {
      const stage = ROADMAP_ELEMENTS[i];
      $(`.roadmap-description-${stage}`).html(ROADMAP_DESCRIPTIONS[i])
      const el = $(`.district-${stage}`)
      el.mouseover(() => {
        $(`.roadmap-description-${stage}`).fadeIn("fast")
        el.css("fill","black")
      })
      el.mouseout(() => {
        $(`.roadmap-description-${stage}`).fadeOut("fast")
        el.css("fill","#00E8E7")
      })
    }

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
}