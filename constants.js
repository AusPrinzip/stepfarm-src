const ONE_MINUTE = 60;
const ZEROES = '000000000000000000';
var SLIPPAGE_TOLERANCE = 0.1;
const DEADLINE_MIN = 20;
var CUSTOM_SLIPPAGE = false;
// dex constants
const ADDRESS_FACTORY = '0xbc790B56F64c98410aAbbbF77E1D685f5a7621a4'
const ADDRESS_ROUTER = '0xa125fD257afCf6B3336867a55fB7dD7910466AcD'
const TOKENS = {
  GFT: '0xC88C6143E1D600c7CB51277DB0de21471702a8a5',
  USDC: '0x64544969ed7ebf5f083679233325356ebe738930',
  USDT: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
  LP: '0x716ae0FdAD4d9D6930DCae12fbA670c2A6740d53'
}


// yield farm constants
const ADDRESS_MASTERCHEF = '0x414f10F8052Ac51A4F8d3287aAc6C02974b99FCf'
const POOLS = [
  {
    name: "GFT",
    allocPoints: 1000,
    lpToken: "0xC88C6143E1D600c7CB51277DB0de21471702a8a5",
    image: ""
  },
  {
    name: "USDC/USDT LP",
    allocPoints: 1000,
    lpToken: "0x716ae0FdAD4d9D6930DCae12fbA670c2A6740d53",
    image: ""
  }
];

// Append here more farming options for Farm page
const FARMING_OPTIONS = [
  ["USDT", "USDC"], ["BUSD", "BNB"], ["USDT", "BNB"]
];