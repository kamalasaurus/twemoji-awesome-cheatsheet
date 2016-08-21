var fs = require('fs');
var path = require('path')

// import this from modules/twemoji-awesome/modules/twemoji-possum/dist/emoji-groups.json
// when it's pushed up
var groups = require('../emoji-groups.json');


///////////////////////////////////////////////////////////////////////////////

var HTML_NAME = path.join('dist', 'index.html');

// var TWEMOJI_NAME = path.join('modules', 'twemoji-awesome', 'twemoji-awesome.css');
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

var contextGroups = Object
  .keys(elementGroups)
  .reduce(function(cGroups, codePoint) {
    elements = elementGroups[codePoint];
    group = groups[codePoint] || groupByName(elements[0]) || 'twemoji-custom';
    cGroups[group] ? cGroups[group].push(elements) : cGroups[group] = [elements];
    return cGroups;
  }, {});

function groupByName(elementName) {
  var map = [
    'smilies-and-people',
    'animals-and-nature',
    'food-and-drink',
    'activity',
    'travels-and-places',
    'objects',
    'symbols',
    'flags',
  ];

  var key = selectName(elementName);
  return map[key];
}

function selectName(name) {
  return [
    [ // smilies-and-people
      /face/,
      /snowboarder/,
      /horse-racing/,
      /skin-type/,
      /family/,
      /couple/,
      /kiss/,
      /dancing/,
      /hand/,
      /fist/,
      /rolling-on-the-floor/,
      /pregnant/,
      /selfie/,
      /prince/,
      /man-in-tuxedo/,
      /mother/,
      /shrug/,
      /cartwheel/,
      /pointing/
    ],
    [ // animals-and-nature
      /sun/,
      /cloud/,
      /snowman/,
      /comet/,
      /snowflake/,
      /wilted-flower/,
      /bat/,
      /shark/,
      /owl/,
      /fox-face/,
      /butterfly/,
      /deer/,
      /gorilla/,
      /lizard/,
      /rhino/,
      /shrimp/,
      /squid/,
      /eagle/,
      /duck/,
    ],
    [ // food-and-drink
      /beverage/,
      /croissant/,
      /avocado/,
      /cucumber/,
      /bacon/,
      /potato/,
      /carrot/,
      /baguette/,
      /salad/,
      /shallow-pan/,
      /egg/,
      /milk/,
      /peanuts/,
      /flatbread/,
      /kiwifruit/,
      /pancakes/
    ],
    [ // activity
      /scooter/,
      /canoe/,
      /juggling/,
      /fencer/,
      /wrestlers/,
      /water-polo/,
      /handball/,
      /boxing/,
      /martial-arts/,
      /soccer/,
      /baseball/,
      /sailboat/,
      /tent/,
    ],
    [ // travels-and-places
      /church/,
      /fountain/,
      /fuel/,
    ],
    [ //objects
      /keyboard/,
      /umbrella/,
      /hot-springs/,
      /anchor/,
      /scissors/,
      /airplane/,
      /envelope/,
      /black-nib/,
      /octagonal-sign/,
      /shopping-trolley/,
      /drum/,
      /glass/,
      /spoon/,
      /goal-net/,
      /medal/,
      /watch/,
      /hourglass/,
      /phone/,

    ],
    [ //symbols
      /exclamation/,
      /information/,
      /arrow/,
      /ballot/,
      /skull/,
      /radioactive/,
      /biohazard/,
      /cross/,
      /dharma/,
      /aries/,
      /taurus/,
      /sagittarius/,
      /capricorn/,
      /aquarius/,
      /pisces/,
      /spade/,
      /club/,
      /hearts/,
      /heart-suit/,
      /heavy-heart/,
      /red-heart/,
      /diamond/,
      /check-mark/,
      /multiplication-x/,
      /star/,
      /asterisk/,
      /sparkle/,
      /wavy-dash/,
      /ideograph/,
      /mahjong/,
      /button/,
      /squared/,
      /black-heart/,
      /speech-bubble/,
      /hash/,
      /circle/,
      /square/,
      /yin-yang/,
      /gemini/,
      /cancer/,
      /leo/,
      /virgo/,
      /libra/,
      /scorpius/,
      /recycling/,
      /wheelchair/,
      /warning/,
      /voltage/,
      /circle/,
      /no-entry/,
      /pencil/,
      /cross/,
      /alternation/,
      /peace/,
      /zero/,
      /one/,
      /two/,
      /three/,
      /four/,
      /five/,
      /six/,
      /seven/,
      /eight/,
      /nine/,
      /ten/,
    ],
    [ //flags
      /^(?=.*\bflag\b)(?=^((?!rainbow).)*$)(?=^((?!pirate).)*$).*$/,
    ],
  ].map(function(tests) {
    return tests
      .map(function(test) { return test.test(name); })
      .some(function(isTrue) { return isTrue; });
  }).indexOf(true);

}


var sections = Object
  .keys(contextGroups)
  .map(makeSection);

///////////////////////////////////////////////////////////////////////////////


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
  '\t\t\t<div class="subheader">',
  '\t\t\t\t<h1>Twemoji Awesome Cheatsheet</h1>',
  '\t\t\t\t<p>make sure to declare &lt;meta charset=&quot;UTF-8&quot;&gt; in the head of your app if you\'re using the non-ascii classes like åland-flag</p>',
  '\t\t\t</div>',
].join('\n');

var footer = [
  '\t\t</div>',
  '\t</body>',
  '</html>',
].join('\n');


function makeSection(groupName) {
  var elements = contextGroups[groupName]
    .map(makeElement)
    .join('\n');

  return [
    '\t\t\t<div class="section">',
    '<h2>',
    groupName.split('-').map(function(n) { return n.charAt(0).toUpperCase() + n.slice(1); }).join(' '),
    '</h2>',
    elements,
    '\t\t\t</div>',
  ].join('\n');
}

function makeElement(names) {

  var nameSpans = names.map(function(name) {
    return '\t\t\t\t<span>' + name + '</span>';
  }).join('\n');

  return [
    '\t\t\t<div class="element">',
    '\t\t\t\t<i class="twa ' + names[0] + '"></i>',
    nameSpans,
    '\t\t\t</div>',
  ].join('\n');
}

var html = header + '\n' + subheader + '\n' + sections.join('\n') + '\n' + footer;

fs.writeFileSync(HTML_NAME, html);
fs.createReadStream(TWEMOJI_NAME).pipe(fs.createWriteStream(TWEMOJI_OUTPUT));
fs.createReadStream(STYLES_NAME).pipe(fs.createWriteStream(STYLES_OUTPUT));

console.log('cheat sheet website generated');

