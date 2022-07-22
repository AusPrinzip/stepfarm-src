
var {obfuscate} = require('javascript-obfuscator');
const config = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  numbersToExpressions: true,
  simplify: true,
  stringArrayShuffle: true,
  splitStrings: true,
  stringArrayThreshold: 1
};
const fs = require("fs");
const fse = require('fs-extra');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var dir = path.resolve("../../", "stepfarm_obf")

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
} else {
  console.log("stepfarm_obf dir already exists")
}

var moveFrom = path.resolve(__dirname, "../", "scripts");
var moveTo = path.resolve(__dirname, "../", "scripts_obfuscated", "out.js")

let code = '';

// Loop through all the files in the temp directory
const files = fs.readdirSync(moveFrom)

files.forEach(file => {
  const filePath = path.resolve(moveFrom, file);
  if (fs.statSync(filePath).isFile()) {
    code += fs.readFileSync(filePath);
  }
})

// console.log(typeof code)
const obfuscated = obfuscate(code, config)._obfuscatedCode
// console.log(obfuscated)
fs.writeFileSync(moveTo, obfuscated)


// copy everything but "./scripts" to the repo copy

let srcDir = path.resolve(__dirname, "../", "scripts_obfuscated");
let destDir = path.resolve(__dirname, "../..", "stepfarm_obf", "scripts_obfuscated");
// return console.log(srcDir, destDir)
// To copy a folder or file  
fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
  if (err) {                
    console.error(err);       
  } else {
    console.log("success!");
  }
});

srcDir = path.resolve(__dirname, "../..", "stepfarm");
destDir = path.resolve(__dirname, "../..", "stepfarm_obf");
// return console.log(srcDir, destDir)        
// To copy a folder or file  
fse.copySync("../", "../../stepfarm_obf", { overwrite: false }, function (err) {
  if (err) {                
    console.error(err);       
  } else {
    console.log("success!");
  }
});