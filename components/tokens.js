class Tokens extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    let buttonsHTML = '';
    for (let token in TOKENS) {
      // const token = TOKENS[i];
      buttonsHTML += `<button type="button" value="${token}" class="list-group-item token-element"><img src="/images/coins/${token}.png"></img>${token}
              </button>`
    }
    this.innerHTML = `
      <center>
      <div id="tokenModal" class="modal">
        <div id="tokens" class="modal-content">
          
          <button class="settings-close-modal"><span id="closeTokenModal" class="closeModal">&times;</span></button>
          <h2>Select a Token</h2>
          <div class="modal-body">
            <div class="list-group">
              ${buttonsHTML}
            </div>
          </div>
        </div>
      </div>
      </center>
    `
  }
}

customElements.define('tokens-component', Tokens);
