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
async function init() {    
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
    "custom-binancechainwallet": {
      display: {
        logo: "images/logo/binance-chain-wallet.png",
        name: "Binance Chain Wallet",
        description: "Connect to your Binance Chain Wallet"
      },
      package: true,
      connector: async () => {
        let provider = null;
        if (typeof window.BinanceChain !== 'undefined') {
          provider = window.BinanceChain;
          try {
            await provider.request({ method: 'eth_requestAccounts' })
          } catch (error) {
            throw new Error("User Rejected");
          }
        } else {
          throw new Error("No Binance Chain Wallet found");
        }
        return provider;
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  if (web3Modal.cachedProvider)
    onConnect(true)
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
  if (chainData.name !== CHAIN_NAME) {
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
        farmConnectInit()
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
async function onConnect(cached = false) {
  if (!cached)
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
  if (provider.close)
    await provider.close();
  await web3Modal.clearCachedProvider();
  provider = null;

  selectedAccount = null;

  // Set the UI back to the initial state

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
  document.querySelector("#btn-bscscan").addEventListener("click", function() {
    window.open("https://bscscan.com/address/"+selectedAccount, '_blank').focus();
  });
});

