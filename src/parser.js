var fs = require('fs');
var path = require('path')


var HTML_NAME = path.join('dist', 'index.html');

//var INPUT_NAME = path.join('modules', 'twemoji-awesome', 'twemoji-awesome.css');
var TWEMOJI_NAME = 'twemoji-awesome.css';
var TWEMOJI_OUTPUT = path.join('dist', 'twemoji-awesome.css');

var STYLES_NAME = path.join('src', 'styles.css');
var STYLES_OUTPUT = path.join('dist', 'styles.css');


var awesomeCss = fs.readFileSync(TWEMOJI_NAME, 'utf8');
var elements = awesomeCss
  .split('\n\n')
  .map(function(rule) {
    return rule.match(/[^\s]+/)[0]
      .replace(/\./g, ''); // only get class names from the css rule
  })
  .slice(1)
  .filter(function(name) {
    return !~[
      'twa-lg',
      'twa-2x',
      'twa-3x',
      'twa-4x',
      'twa-5x'
    ].indexOf(name); // filter out the non-emoji declarations
  })
  .map(makeElement);

var header = [
  '<!doctype html>',
  '<html>',
  '\t<head>',
  '\t\t<title>Twemoji Awesome Cheatsheet! 😃🤑😂</title>',
  '\t\t<link rel="stylesheet" type="text/css" href="twemoji-awesome.css">',
  '\t\t<link rel="stylesheet" type="text/css" href="styles.css">',
  '\t</head>',
  '\t<body>',
  '\t\t<div class="container">',
].join('\n');

var footer = [
  '\t\t</div>',
  '\t</body>',
  '</html>',
].join('\n');


function makeElement(name) {
  return [
    '\t\t\t<div class="element">',
    '\t\t\t\t<i class="twa twa-2x ' + name + '"></i>',
    '\t\t\t\t<span>' + name + '</span>',
    '\t\t\t</div>',
  ].join('\n');
}

var html = header + '\n' + elements.join('\n') + '\n' + footer;

fs.writeFileSync(HTML_NAME, html);
fs.createReadStream(TWEMOJI_NAME).pipe(fs.createWriteStream(TWEMOJI_OUTPUT));
fs.createReadStream(STYLES_NAME).pipe(fs.createWriteStream(STYLES_OUTPUT));

console.log('cheat sheet website generated');

