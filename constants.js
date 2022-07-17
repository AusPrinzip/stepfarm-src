
const CHAIN_NAME = "Binance Smart Chain Mainnet";
const PUBLIC_NODE_URL = "https://bsc-dataseed.binance.org/";
const STEPFARM_API = "https://api.stepfarm.io";
const ONE_MINUTE = 60;
const ZEROES = '000000000000000000';
var SLIPPAGE_TOLERANCE = 0.1;
const DEADLINE_MIN = 20;
var CUSTOM_SLIPPAGE = false;
var SPEED = 5;
// dex constants
const ADDRESS_FACTORY = '0xA1655610c226ABcae75213e3206bF988F3bB8723'
const ADDRESS_ROUTER = '0x030692D7231a588BAdC72f3A2a089aB204d79Ea0'
const TOKENS = {
  GMT: '0x3019bf2a2ef8040c242c9a4c5c4bd4c81678b2a1',
  GST: '0x4a2c860cEC6471b9F5F5a336eB4F38bb21683c98',
  GFT: '0xC1223c5064D0823417E18c195Ac0e761cc46d2b0'
}
const TOKENDECIMALS = {
  GMT: 8,
  GST: 8,
  GFT: 18
}


// yield farm constants
const GFT_PER_BLOCK = '1000000000000000000'
const BLOCK_PER_DAY = 28800
const ADDRESS_MASTERCHEF = '0x3e89F83F4B3bEeD5EeC428C0CB7268E615E64Cf5'
const POOLS = [
  {
    name: "GFT",
    allocPoints: 333,
    lpToken: "0xC1223c5064D0823417E18c195Ac0e761cc46d2b0",
    pair: ["GFT", "GFT"],
    multiplier: "x1"
  },
  {
    name: "GMT/GST LP",
    allocPoints: 1000,
    lpToken: "0x1f309d8756e18839c95e502f191aa4c094198fc7",
    pair: ["GMT", "GST"],
    multiplier: "x3"
  },
  {
    name: "GMT/GFT LP",
    allocPoints: 1000,
    lpToken: "0x8f2d5a8de8e28f2f7480d72538e758468ed1c4c9",
    pair: ["GMT", "GFT"],
    multiplier: "x3"
  },
  {
    name: "GST/GFT LP",
    allocPoints: 1000,
    lpToken: "0x37de1aa7901a6b3256a21d0605140d8a4d1cfd87",
    pair: ["GST", "GFT"],
    multiplier: "x3"
  }
];
let totalAlloc = 0
for (let i = 0; i < POOLS.length; i++)
  totalAlloc += POOLS[i].allocPoints
for (let i = 0; i < POOLS.length; i++)
  POOLS[i].gftPerBlock = GFT_PER_BLOCK*POOLS[i].allocPoints/totalAlloc