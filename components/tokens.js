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
              <button type="button" value="GMT" class="list-group-item token-element"><img src="/images/coins/gmt.png"></img>GMT
              </button>
              <button type="button" value="GST" class="list-group-item token-element"><img src="/images/coins/gst.png"></img>GST
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
