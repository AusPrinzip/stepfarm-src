class Div extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    this.innerHTML = `
      <div id="footer">
          <div class="twitter-container">
            <a><img class="" src="images/icons/twitter.svg"></img></a>
          </div>
          <div class="discord-container">
            <a><img class="" src="images/icons/discord.svg"></img></a>
          </div>
          <div class="telegram-container">
            <a><img class="" src="images/icons/telegram.svg"></img></a>
          </div>
          <div class="medium-container">
            <a><img class="" src="images/icons/medium.svg"></img></a>
          </div>
          <img class="" src="images/footer.svg"></img>
          <div class="copyright-container">
            <h5>Copyright © 2022. All rights reserved</h5>
          </div>
      </div>
    `
  }
}

customElements.define('footer-component', Div);
