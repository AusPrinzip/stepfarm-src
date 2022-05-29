// design related JS logic
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