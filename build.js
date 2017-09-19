const fs = require('fs');
const UglifyJS = require("uglify-js");
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');


let htmlFiles = ['index.html']
let cssFiles = ['css/main.css']
let jsFiles = ['js/main.js']




const contents = fs.readFileSync('README.md', 'utf8');
console.log(contents);