class Tokens extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    this.innerHTML = `
      <center>
      <div id="tokenModal" class="modal">
        <div id="tokens" class="modal-content">
          
          <button class="settings-close-modal"><span id="closeTokenModal" class="closeModal">&times;</span></button>
          <h2>Select a Token</h2>
          <div class="modal-body">
            <div class="list-group">
              <button type="button" value="GFT" class="list-group-item token-element"><img src="/images/coins/gft.png"></img>GFT
              </button>
              <button type="button" value="USDT" class="list-group-item token-element"><img src="/images/coins/usdt.png"></img>USDT
              </button>
              <button type="button" value="USDC" class="list-group-item token-element"><img src="/images/coins/usdc.png"></img>USDC
              </button>
            </div>
          </div>
        </div>
      </div>
      </center>
    `
  }
}

customElements.define('tokens-component', Tokens);
