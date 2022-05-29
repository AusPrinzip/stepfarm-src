// design related JS logic
const PLACEHOLDER_1 = "Sweet and Tone is a seven-day bodyweight training program designed to boost your strength and endurance over the course of a week.";
const PLACEHOLDER_2 = "Sweet and Tone is a seven-day bodyweight training program designed to boost your strength and";
const PLACEHOLDER_3 = "Lorem Ipsum Dolor Sit Amet";

window.addEventListener('resize', function () { // conditional rendering based on viewport width
  if (viewportWidth <= 375) {
    $('.span').text(PLACEHOLDER_3);
    $('.shoe').attr("src", "/images/shoe-mobile.svg");
    $('.hero').attr("src", "/images/hero-mobile.svg");
    $('.stat').hide()
    $('.stats-rows').hide()
  } else {
    $('.span').text(PLACEHOLDER_1);
    $('.shoe').attr("src", "/images/shoe.svg");
    $('.hero').attr("src", "/images/hero.svg");
    $('.stat').show()
    $('.stats-rows').show()
  }
}, false);

window.addEventListener('load', function () {

  if (viewportWidth <= 375) {
    $('.span').text(PLACEHOLDER_3);
    $('.shoe').attr("src", "/images/shoe-mobile.svg");
    $('.hero').attr("src", "/images/hero-mobile.svg");
    $('.stat').hide()
    $('.stats-rows').hide()
  } else {
    $('.span').text(PLACEHOLDER_1);
    $('.shoe').attr("src", "/images/shoe.svg");
    $('.hero').attr("src", "/images/hero.svg");
    $('.stat').show()
    $('.stats-rows').show()
  }

  const counters = 4;
  for (let i = 1; i <= counters; i ++) {
    const el = document.querySelector(`.counter${i}`);
    const counterUp = window.counterUp.default;
    new Waypoint( {
        element: el,
        handler: function() { 
            counterUp( el ) 
            this.destroy()
        },
        offset: 'bottom-in-view',
    } )
  }
})