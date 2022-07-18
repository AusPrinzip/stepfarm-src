// design related JS logic
function addEmail() {
  $.post(STEPFARM_API+"/mailing", { email: email.value })
  .done(function( data ) {
    console.log(data)
    alert(data)
  });
}

function numberWithCommas(x, y = 2) {
    return parseFloat(x).toFixed(y).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fadeColor () {
  console.log("highlighting")
  $("#start").toggle( "highlight" );
  $("#start").toggle( "highlight" );
}

function indexInit() {
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