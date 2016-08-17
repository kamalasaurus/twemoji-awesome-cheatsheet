var fs = require('fs');
var path = require('path')


var HTML_NAME = path.join('dist', 'index.html');

//var INPUT_NAME = path.join('modules', 'twemoji-awesome', 'twemoji-awesome.css');
var TWEMOJI_NAME = 'twemoji-awesome.css';
var TWEMOJI_OUTPUT = path.join('dist', 'twemoji-awesome.css');

var STYLES_NAME = path.join('src', 'styles.css');
var STYLES_OUTPUT = path.join('dist', 'styles.css');


var awesomeCss = fs.readFileSync(TWEMOJI_NAME, 'utf8');

// only get class names and codePoints from the css rule
function stripExcess(rule) {
  name = rule
    .match(/[^\s]+/)[0]
    .replace(/\./g, '');

  codePoint = rule
    .split('/')
    .slice(-1)[0]
    .split('.')[0];

  return [name, codePoint];
}

// filter out the non-emoji declarations
function filterModifiers(namePointPair) {
  return !~[
    'twa-lg',
    'twa-2x',
    'twa-3x',
    'twa-4x',
    'twa-5x'
  ].indexOf(namePointPair[0]);
}

function groupByPoint(group, namePointPair) {
  var name = namePointPair[0];
  var point = namePointPair[1];
  group[point] ? group[point].push(name) : group[point] = [name];
  return group;
}

var elementGroups = awesomeCss
  .split('\n\n')
  .slice(1)
  .map(stripExcess)
  .filter(filterModifiers)
  .reduce(groupByPoint, {});

var elements = Object
  .keys(elementGroups)
  .map(makeElement);

var header = [
  '<!doctype html>',
  '<html>',
  '\t<head>',
  '\t\t<meta charset="UTF-8">',
  '\t\t<title>Twemoji Awesome Cheatsheet! 😃🤑😂</title>',
  '\t\t<link rel="stylesheet" type="text/css" href="twemoji-awesome.css">',
  '\t\t<link rel="stylesheet" type="text/css" href="styles.css">',
  '\t</head>',
  '\t<body>',
  '\t\t<div class="container">',
].join('\n');

var subheader = [
  '\t\t\t<div class="subheader>"',
  '\t\t\t\t<h1>Twemoji Awesome Cheatsheet</h1>',
  '\t\t\t\t<p>make sure to declare <meta charset="UTF-8"> in the head of your app if you\'re using the non-ascii classes like åland-flag</p>',
  '\t\t\t</div>',
].join('\n');

var footer = [
  '\t\t</div>',
  '\t</body>',
  '</html>',
].join('\n');


function makeElement(names) {
  return [
    '\t\t\t<div class="element">',
    '\t\t\t\t<i class="twa twa-2x ' + name[0] + '"></i>',
    '\t\t\t\t<span>' + names.join(', ') + '</span>',
    '\t\t\t</div>',
  ].join('\n');
}

var html = header + '\n' + subheader + '\n' + elements.join('\n') + '\n' + footer;

fs.writeFileSync(HTML_NAME, html);
fs.createReadStream(TWEMOJI_NAME).pipe(fs.createWriteStream(TWEMOJI_OUTPUT));
fs.createReadStream(STYLES_NAME).pipe(fs.createWriteStream(STYLES_OUTPUT));

console.log('cheat sheet website generated');

