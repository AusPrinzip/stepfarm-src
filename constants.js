const STEPFARM_API = "http://127.0.0.1:3002";
const ONE_MINUTE = 60;
const ZEROES = '000000000000000000';
var SLIPPAGE_TOLERANCE = 0.1;
const DEADLINE_MIN = 20;
var CUSTOM_SLIPPAGE = false;
var SPEED = 5;
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
const GFT_PER_BLOCK = '1000000000000000000'
const BLOCK_PER_DAY = 28800
const ADDRESS_MASTERCHEF = '0x414f10F8052Ac51A4F8d3287aAc6C02974b99FCf'
const POOLS = [
  {
    name: "GFT",
    allocPoints: 233,
    lpToken: "0xC88C6143E1D600c7CB51277DB0de21471702a8a5",
    pair: ["GFT", "GFT"],
    multiplier: "23x"
  },
  {
    name: "USDC/USDT LP",
    allocPoints: 500,
    lpToken: "0x716ae0FdAD4d9D6930DCae12fbA670c2A6740d53",
    pair: ["USDC", "USDT"],
    multiplier: "50x"
  },
  {
    name: "USDC/GFT LP",
    allocPoints: 200,
    lpToken: "0x3af995f21529541f7e5a51bd4ab3c06761f7120f",
    pair: ["USDC", "GFT"],
    multiplier: "20x"
  },
];
let totalAlloc = 0
for (let i = 0; i < POOLS.length; i++)
  totalAlloc += POOLS[i].allocPoints
for (let i = 0; i < POOLS.length; i++)
  POOLS[i].gftPerBlock = GFT_PER_BLOCK*POOLS[i].allocPoints/totalAlloc