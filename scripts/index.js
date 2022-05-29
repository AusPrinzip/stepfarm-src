// design related JS logic
const PLACEHOLDER_1 = "Sweet and Tone is a seven-day bodyweight training program designed to boost your strength and endurance over the course of a week.";
const PLACEHOLDER_2 = "Sweet and Tone is a seven-day bodyweight training program designed to boost your strength and";
const PLACEHOLDER_3 = "Lorem Ipsum Dolor Sit Amet";

window.addEventListener('resize', function () { // conditional rendering based on viewport width
  if (viewportWidth <= 640) {
    $('.span').text(PLACEHOLDER_3);
  } else {
    $('.span').text(PLACEHOLDER_1);
  }
}, false);

window.addEventListener('load', function () {
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