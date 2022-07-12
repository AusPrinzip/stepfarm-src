class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    this.innerHTML = `
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <!-- Brand and toggle get grouped for better mobile display -->
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/#"><img src="images/logo/logo.svg"></img></a>
            <span class="price-mobile" id="gft-price">1 GFT = ? USDC</span>
          </div>


          <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-collapse-vertical-aligned">
              <li><a href="/#swap">SWAP</a></li>
              <li><a href="/#farm">FARM</a></li>
              <li><a href="/#liquidity">LIQUIDITY</a></li>
              <li><a href="https://stepfarm.gitbook.io/stepfarm" target="_blank">DOCS</a></li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle hidden-sm hidden-md hidden-bg hidden-lg" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">SOCIAL MEDIA <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a class="" href="https://twitter.com/StepFarm"><img src="images/icons/twitter.svg"></img>Twitter</a></li>
                  <li><a class="" href="https://t.me/StepFarmGFT" target="_blank"><img src="images/icons/telegram.svg"></img>Telegram</a></li>
                  <li><a class="" href="https://discord.gg/gC72KwH4Gp" target="_blank"><img src="images/icons/discord.svg"></img>Discord</a></li>
                  <li><a class="" href="https://medium.com/@stepfarm" target="_blank"><img src="images/icons/medium.svg"></img>Medium</a></li>
                </ul>
              </li>
            </ul>
            

            <ul class="nav navbar-nav navbar-right">
              <li><a class="hidden-xs" href="https://discord.gg/gC72KwH4Gp" target="_blank"><img src="images/navbar-icons/discord.svg"></img></a></li>
              <li><a class="hidden-xs" href="https://medium.com/@stepfarm" target="_blank"><img src="images/navbar-icons/medium.svg"></img></a></li>
              <li><a class="hidden-xs" href="https://twitter.com/StepFarm" target="_blank"><img src="images/nav-twitter.svg"></img></a></li>
              <li><button id="btn-connect" class="connect-wallet-btn">CONNECT WALLET</button></li>
              <li class="dropdown" id="wallet-dropdown" style="display: none;">
                <div id="wallet" class="connect-wallet-btn wallet"></div>
                <ul class="dropdown-menu clearfix wallet-dropdown" role="menu">
                  <li class="wallet-dropdown-el"><a id="btn-disconnect">Disconnect</a></li>
                  <li class="wallet-dropdown-el"><a id="btn-bscscan">See on BscScan</a></li>
                </ul>
                </li>
            </ul>

          </div><!-- /.navbar-collapse -->

        </div><!-- /.container-fluid -->
      </nav>
    `
  }
}

customElements.define('header-component', Header);
