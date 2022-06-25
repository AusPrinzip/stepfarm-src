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
  GST: '0x4a2c860cEC6471b9F5F5a336eB4F38bb21683c98'
}
const TOKENDECIMALS = {
  GMT: 8,
  GST: 8
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