// design related JS logic

function fadeColor () {
  console.log("highlighting")
  $("#start").toggle( "highlight" );
  $("#start").toggle( "highlight" );
}

function indexInit() {

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
      // $('.span').text(PLACEHOLDER_3);
      // $('.shoe').attr("src", "/images/shoe-mobile.svg");
      $('.hero').attr("src", "/images/hero-mobile.svg");
      $('.triangle').show();
      // $('.navbar-right').hide();
      // $('.stat').hide()
      $('.stats-rows').hide()
    } else {
      // $('.span').text(PLACEHOLDER_1);
      // $('.shoe').attr("src", "/images/shoe.svg");
      $('.hero').attr("src", "/images/hero.svg");
      $('.stat').show()
      $('.stats-rows').show()
      $('.triangle').hide();
    }
  }, false);

  if (viewportWidth <= 544) {
    // $('.span').text(PLACEHOLDER_3);
    // $('.shoe').attr("src", "/images/shoe-mobile.svg");
    $('.hero').attr("src", "/images/hero-mobile.svg");
    $('.triangle').show();
    // $('.stat').hide()
    // $('.navbar-right').hide();
    $('.stats-rows').hide()
  } else {
    // $('.span').text(PLACEHOLDER_1);
    // $('.shoe').attr("src", "/images/shoe.svg");
    $('.hero').attr("src", "/images/hero.svg");
    $('.stat').show()
    $('.stats-rows').show()
    $('.triangle').hide();
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