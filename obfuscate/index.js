var {minify} = require("uglify-js");
const fs = require("fs")

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