class Div extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    this.innerHTML = `
      <div id="footer">
          <div class="twitter-container">
            <a href="https://twitter.com/StepFarm" target="_blank"><img class="" src="images/icons/twitter.svg"></img></a>
          </div>
          <div class="discord-container">
            <a target="https://twitter.com/StepFarm" href="https://discord.gg/gC72KwH4Gp" target="_blank"><img class="" src="images/icons/discord.svg"></img></a>
          </div>
          <div class="telegram-container">
            <a href="https://t.me/+GugtFxYudhtiYWE0" target="_blank"><img class="" src="images/icons/telegram.svg"></img></a>
          </div>
          <div class="medium-container">
            <a target="_blank"><img class="" src="images/icons/medium.svg"></img></a>
          </div>
          <center><img class="" src="images/footer.svg"></img></center>
          <div class="copyright-container">
            <h5>Copyright © 2022. All rights reserved</h5>
          </div>
      </div>
    `
  }
}

customElements.define('footer-component', Div);
