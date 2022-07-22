var {minify} = require("uglify-js");
const fs = require("fs");
const fse = require('fs-extra');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

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

// console.log(code)
const obfuscated = minify(code).code
fs.writeFileSync(moveTo, obfuscated)


// copy everything but "./scripts" to the repo copy

let srcDir = path.resolve(__dirname, "../", "scripts_obfuscated");
let destDir = path.resolve(__dirname, "../..", "stepfarm_obf", "scripts_obfuscated");
                              
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
                              
// To copy a folder or file  
fse.copySync(srcDir, destDir, { overwrite: false }, function (err) {
  if (err) {                
    console.error(err);       
  } else {
    console.log("success!");
  }
});