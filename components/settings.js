class Settings extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    this.innerHTML = `
    <center>
      <div id="settingsModal" class="modal">
        <div id="settings" class="modal-content">
          <div class="settings-card-header">
              <div class="swap-card-tag"></div>
              <div class="swap-card-title">Settings</div>
              <button class="settings-close-modal"><span id="closeSettingsModal">&times;</span></button>
          </div>
          <div class="settings-card-container">
            <h4>GLOBAL</h4>
          </div>
          <div class="settings-card-container">
            <p>Default transaction speed</p><img src="/images/question-help.svg"></img>
          </div>
          <div class="settings-card-container">
            <button id="speed-1" class="settings-speed active">Standard (5)</button>
            <button id="speed-2" class="settings-speed">Fast (6)</button>
            <button id="speed-3" class="settings-speed">Instant (7)</button>
          </div>
          <div class="divider"></div>
          <div class="settings-card-container">
            <h4>SWAPS & LIQUIDITY</h4>
          </div>
          <div class="settings-card-container">
            <p>Slippage tolerance</p>
          </div>
          <div class="settings-card-container">
            <button id="slippage-1" class="settings-slippage active">0.1%</button>
            <button id="slippage-2" class="settings-slippage">0.5%</button>
            <button id="slippage-3" class="settings-slippage">1.0%</button>
          </div>
          <div class="settings-card-container">
            <p style="float: left;">Tx deadline (mins)</p>
            <input style="float: right;" id="deadline" type="number" default=20 class="form-control settings-deadline-input" placeholder="Deadline (min)" aria-describedby="basic-addon1">
          </div>
        </div>
      </div>
    </center>

    <style>
      #settings {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        gap: 24px;
        top: 10%;
        position: relative;
        z-index: 3;
        background: #FCFCFC;

        /* shadow */
        box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);
        border-radius: 24px;
      }
      .settings-close-modal {
        padding: 0;
        border: none;
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        width: 40px;
        height: 40px;
        background: #EFEFEF;
        border-radius: 12px;
      }
      .settings-close-modal span:hover {
        filter: brightness(60%);
      }

      .settings-card-container {
        display: flex;
        gap: 0;
        flex-direction: row;
        align-items: flex-start;
        height: 40px;
        padding: 0;
        margin: 0;
        width: 100%;
        height: 2vh;
      }

      .divider {
        width:100%;
        height: 1vh;
        border-bottom: 1px solid rgb(231, 227, 235);
      }
      .settings-card-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }
      .settings-speed {
        padding: 0;
        border: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 8px 12px;
        gap: 8px;

        width: 117px;
        height: 36px;

        background: #EFEFEF; 
        border-radius: 30px;

        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
      }

      .settings-slippage {
        padding: 0;
        border: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 8px 12px;
        gap: 8px;

        width: 53px;
        height: 36px;

        background: #EFEFEF;
        border-radius: 30px;

        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
      }

      .settings-card-container button:hover {
        background: #80F4F3;
      }

      .active {
        background: #00E8E7 !important;
      }

      .settings-deadline-input {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
 

        width: 75px;
        height: 36px;

        border: 2px solid #37E4E5;
        border-radius: 30px;
      }
    </style>
    `
  }
}

customElements.define('settings-component', Settings);
