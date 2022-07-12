class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    this.innerHTML = `
    <div id="footer">
      <div class="footer-rectangle">
        <div class="footer-icon twitter-container">
          <a href="https://twitter.com/StepFarm" target="_blank"><img class="" src="images/icons/twitter.svg"></img></a>
        </div>
        <div class="footer-icon discord-container">
          <a href="https://discord.gg/gC72KwH4Gp" target="_blank"><img class="" src="images/icons/discord.svg"></img></a>
        </div>
        <div class="footer-icon telegram-container">
          <a href="https://t.me/StepFarmGFT" target="_blank"><img class="" src="images/icons/telegram.svg"></img></a>
        </div>
        <div class="footer-icon medium-container">
          <a href="https://medium.com/@stepfarm" target="_blank"><img class="" src="images/icons/medium.svg"></img></a>
        </div>
        <center><img class="" src="images/footer.svg"></img></center>

      </div>
        <div class="copyright-container">
          <h5>Copyright © 2022. All rights reserved</h5>
        </div>
    </div>
    `
  }
}

customElements.define('footer-component', Footer);
