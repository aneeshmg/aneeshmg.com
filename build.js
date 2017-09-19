const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const UglifyJS = require("uglify-js");
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');


const contents = fs.readFileSync('README.md', 'utf8');
console.log(contents);