"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;
const Torus = window.Torus;

evmChains.chains.push({
  chain: "TST",
  chainId: 1337,
  faucets: [],
  infoURL: "http://",
  name: "Ganache",
  nativeCurrency: { name: "Ganache", symbol: "TEST", decimals: 18 },
  network: "ganache",
  networkId: 1337,
  rpc: [],
  shortName: "ganache"
})

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


/**
 * Setup the orchestra
 */
function init() {

  // console.log("Initializing example");
  // console.log("WalletConnectProvider is", WalletConnectProvider);
  // console.log("Fortmatic is", Fortmatic);
  // console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available

  // if(location.protocol !== 'https:') {
  //   // https://ethereum.stackexchange.com/a/62217/620
  //   const alert = document.querySelector("#alert-error-https");
  //   alert.style.display = "block";
  //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  //   return;
  // }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    metamask: {

    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    },

    torus: {
      package: Torus, // required
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  // console.log("Web3Modal instance is", web3Modal);
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);
  
  // Alert if wrong chain
  if (chainData.name !== "Binance Smart Chain Testnet") {
    alert("Wrong chain")
  }

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  // console.log("Got accounts", accounts);
  selectedAccount = accounts[0];


  $('#wallet').html(`<img src="images/wallet.svg"></img>${selectedAccount.substring(0, 3)}...${selectedAccount.substring(selectedAccount.length - 3, selectedAccount.length)}`);

  // if (window.location.hash == "#swap") {
  //   console.log(selectedAccount)
  //   document.querySelector("#network-name").textContent = chainData.name;
  //   document.querySelector("#selected-account").textContent = selectedAccount;
  // }
  
  var location = window.location.hash.replace("#", "");
  if (location.length == 0) {
    location = "/";
  }
  // trigger functions for each page
  switch (location) {
    case '/':
        break;
    case 'swap':
        swapConnectInit()
        break;
    case 'farm':
        break;
    case 'add':
        break;
    case 'liquidity':
        liquidityConnectInit()
        break;
    default:
        console.log('Unknown route: '+location)
  }
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {
  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {
  web3Modal.clearCachedProvider(); // IMPORTANT on Chrome BRowser otherwise it will just ignore optional wallets and load metamask right away
  // console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
    $('#btn-connect').hide();
    $('#wallet-dropdown').show();    
  } catch(e) {
    // console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  // console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state

  if (window.location.hash == "#swap") {
    // document.querySelector("#prepare").style.display = "block";
    document.querySelector("#connected").style.display = "none";
  }
  $('#wallet-dropdown').hide();
  $('#btn-connect').show();
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});

