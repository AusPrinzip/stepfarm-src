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
          </div>

          <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-collapse-vertical-aligned">
              <li><a href="/#swap">SWAP</a></li>
              <li><a href="/#farm">FARM</a></li>
              <li><a href="/#liquidity">LIQUIDITY</a></li>
            </ul>

            <div id="gft-price"></div>

            <ul class="nav navbar-nav navbar-right navbar-nav-vertical-aligned">
              <li><a class="" href="#"><img src="images/nav-facebook.svg"></img></a></li>
              <li><a class="" href="#"><img src="images/nav-twitter.svg"></img></a></li>
              <li><a class="" href="#"><img src="images/nav-instagram.svg"></img></a></li>
              <li><button id="btn-connect" class="connect-wallet-btn">CONNECT WALLET</button></li>
              <li><button style="display: none;" id="btn-disconnect" class="connect-wallet-btn">DISCONNECT WALLET</button></li>
            </ul>

          </div><!-- /.navbar-collapse -->

        </div><!-- /.container-fluid -->
      </nav>
    `
  }
}

customElements.define('header-component', Header);
